#!/usr/bin/env node

/**
 * scan-hh.mjs — HH.ru structured scanner (RU fork)
 *
 * Two modes:
 *   A) Playwright (DEFAULT) — no API key, works for all users.
 *      Navigates hh.ru/search/vacancy and parses cards from DOM.
 *   B) API (opt-in only) — activated ONLY if `hh_api_token` is set in
 *      config/profile.yml. Uses api.hh.ru with Bearer auth.
 *
 * There is NO silent fallback between modes. API path fails loudly on
 * 401/403 so the user knows to refresh the token.
 *
 * Reads:
 *   - config/profile.yml        → hh_api_token (optional), user agent contact
 *   - portals.yml               → hh_queries list, title_filter
 *
 * Writes:
 *   - data/hh-scan-YYYYMMDD.jsonl (one vacancy per line, with source: api|playwright)
 *
 * Usage:
 *   node scan-hh.mjs [--dry-run]
 *
 * IMPORTANT: NEVER run this concurrently with other Playwright processes
 * (pipeline.md, check-liveness.mjs) — they share one browser instance.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = __dirname;

// ─────────────────────────────────────────────
// Minimal YAML reader (handles the subset we need from portals.yml
// and profile.yml — no deps). Not a full YAML parser; supports:
//   top-level scalars, nested maps, lists of scalars, lists of maps.
// ─────────────────────────────────────────────

function parseYamlSubset(text) {
  const lines = text.split(/\r?\n/);
  const root = {};
  const stack = [{ indent: -1, node: root, key: null }];

  for (let rawLine of lines) {
    // Strip comments (but not inside quoted strings — we treat naively)
    const commentIdx = findUnquoted(rawLine, '#');
    let line = commentIdx >= 0 ? rawLine.slice(0, commentIdx) : rawLine;
    if (!line.trim()) continue;

    const indent = line.match(/^(\s*)/)[1].length;
    const content = line.slice(indent);

    // Pop stack until we're at a valid parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];

    if (content.startsWith('- ')) {
      // List item
      const itemText = content.slice(2).trim();
      if (!Array.isArray(parent.node)) {
        // Convert parent key to array if we had an empty map
        throw new Error(`Unexpected list item at line: "${rawLine}"`);
      }
      if (itemText.includes(':') && !looksLikeScalar(itemText)) {
        // Inline "key: value" starts a new map inside the list
        const [k, v] = splitKeyValue(itemText);
        const obj = {};
        if (v !== '') obj[k] = parseScalar(v);
        else obj[k] = null;
        parent.node.push(obj);
        stack.push({ indent, node: obj, key: null });
        // If a key was started without value, next deeper lines will populate it
        if (v === '') {
          stack.push({ indent: indent + 2, node: obj, key: k, pendingMap: true });
        }
      } else {
        parent.node.push(parseScalar(itemText));
      }
      continue;
    }

    // Key: value (or key: with nested content)
    if (content.includes(':')) {
      const [k, v] = splitKeyValue(content);
      if (v === '') {
        // New nested structure — peek next non-empty line to decide list vs map
        const childNode = {}; // default to map; will convert to array if next line is "- "
        if (Array.isArray(parent.node)) {
          // Shouldn't reach here — parent is list but we got key:value without "- "
          throw new Error(`Unexpected key in list at line: "${rawLine}"`);
        }
        parent.node[k] = childNode;
        stack.push({ indent, node: childNode, key: k, lazyContainer: true });
      } else {
        if (Array.isArray(parent.node)) {
          throw new Error(`Unexpected key in list context at line: "${rawLine}"`);
        }
        parent.node[k] = parseScalar(v);
      }
      continue;
    }
  }

  // Second pass: convert lazyContainer maps that received only "- " children into arrays.
  // Actually we need to handle this during parsing — let me re-do with a smarter approach.
  return root;
}

// The above simplified parser is fragile. Let's use a more robust approach:
// parse by detecting "key:\n  - item" patterns explicitly.

function parseYaml(text) {
  // Strip comments
  const rawLines = text.split(/\r?\n/).map((l) => {
    const idx = findUnquoted(l, '#');
    return idx >= 0 ? l.slice(0, idx).replace(/\s+$/, '') : l.replace(/\s+$/, '');
  });

  const lines = [];
  for (const l of rawLines) {
    if (l.trim() !== '') lines.push(l);
  }

  let i = 0;

  function peekIndent(idx) {
    if (idx >= lines.length) return -1;
    const m = lines[idx].match(/^(\s*)/);
    return m[1].length;
  }

  function parseBlock(baseIndent) {
    // Decide: is this block a list (starts with "- ") or a map (key: ...)?
    if (i >= lines.length) return null;
    const firstIndent = peekIndent(i);
    if (firstIndent !== baseIndent) return null;

    const firstContent = lines[i].slice(baseIndent);
    if (firstContent.startsWith('- ')) {
      return parseList(baseIndent);
    }
    return parseMap(baseIndent);
  }

  function parseMap(baseIndent) {
    const out = {};
    while (i < lines.length) {
      const ind = peekIndent(i);
      if (ind < baseIndent) break;
      if (ind > baseIndent) {
        // Shouldn't happen at map level — break defensively
        break;
      }
      const content = lines[i].slice(baseIndent);
      if (content.startsWith('- ')) break; // switching to list context
      const colonIdx = findUnquoted(content, ':');
      if (colonIdx < 0) {
        i++;
        continue;
      }
      const key = content.slice(0, colonIdx).trim();
      const val = content.slice(colonIdx + 1).trim();
      i++;
      if (val === '') {
        // Nested value
        const nextInd = peekIndent(i);
        if (nextInd > baseIndent) {
          out[key] = parseBlock(nextInd);
        } else {
          out[key] = null;
        }
      } else {
        out[key] = parseScalar(val);
      }
    }
    return out;
  }

  function parseList(baseIndent) {
    const out = [];
    while (i < lines.length) {
      const ind = peekIndent(i);
      if (ind < baseIndent) break;
      if (ind > baseIndent) break;
      const content = lines[i].slice(baseIndent);
      if (!content.startsWith('- ')) break;
      const itemText = content.slice(2).trim();
      i++;
      if (itemText === '') {
        // Empty list item — parse nested block
        const nextInd = peekIndent(i);
        if (nextInd > baseIndent) {
          out.push(parseBlock(nextInd));
        } else {
          out.push(null);
        }
      } else if (itemText.includes(':') && !looksLikeScalar(itemText)) {
        // Inline key: value — start a map for this list item
        const colonIdx = findUnquoted(itemText, ':');
        const key = itemText.slice(0, colonIdx).trim();
        const val = itemText.slice(colonIdx + 1).trim();
        const obj = {};
        if (val !== '') {
          obj[key] = parseScalar(val);
        }
        // Continue reading subsequent lines at deeper indent as part of this map
        const itemBaseIndent = baseIndent + 2; // "- " adds 2 to effective indent
        while (i < lines.length) {
          const ind2 = peekIndent(i);
          if (ind2 < itemBaseIndent) break;
          if (ind2 > itemBaseIndent) {
            // Deeper nested under the current key — assign via parseBlock
            // (rare; we don't fully support this here)
            break;
          }
          const c2 = lines[i].slice(itemBaseIndent);
          if (c2.startsWith('- ')) break;
          const cIdx = findUnquoted(c2, ':');
          if (cIdx < 0) {
            i++;
            continue;
          }
          const k2 = c2.slice(0, cIdx).trim();
          const v2 = c2.slice(cIdx + 1).trim();
          i++;
          if (v2 === '') {
            const nextInd = peekIndent(i);
            if (nextInd > itemBaseIndent) {
              obj[k2] = parseBlock(nextInd);
            } else {
              obj[k2] = null;
            }
          } else {
            obj[k2] = parseScalar(v2);
          }
        }
        out.push(obj);
      } else {
        out.push(parseScalar(itemText));
      }
    }
    return out;
  }

  return parseBlock(0) || {};
}

function findUnquoted(str, ch) {
  let inSingle = false;
  let inDouble = false;
  for (let k = 0; k < str.length; k++) {
    const c = str[k];
    if (c === "'" && !inDouble) inSingle = !inSingle;
    else if (c === '"' && !inSingle) inDouble = !inDouble;
    else if (!inSingle && !inDouble && c === ch) return k;
  }
  return -1;
}

function splitKeyValue(s) {
  const idx = findUnquoted(s, ':');
  if (idx < 0) return [s, ''];
  return [s.slice(0, idx).trim(), s.slice(idx + 1).trim()];
}

function looksLikeScalar(s) {
  // Heuristic: if it starts with quote, it's a scalar string (not a k:v)
  return s.startsWith('"') || s.startsWith("'");
}

function parseScalar(v) {
  if (v === '' || v === '~' || v === 'null') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
  // Strip surrounding quotes
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }
  // Inline list: [a, b, c]
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (inner === '') return [];
    return inner.split(',').map((x) => parseScalar(x.trim()));
  }
  return v;
}

// ─────────────────────────────────────────────
// Config loading
// ─────────────────────────────────────────────

function loadProfile() {
  const path = join(PROJECT_ROOT, 'config', 'profile.yml');
  if (!existsSync(path)) {
    console.error('[scan-hh] config/profile.yml not found');
    process.exit(1);
  }
  return parseYaml(readFileSync(path, 'utf-8'));
}

function loadPortals() {
  const path = join(PROJECT_ROOT, 'portals.yml');
  if (!existsSync(path)) {
    console.error('[scan-hh] portals.yml not found');
    process.exit(1);
  }
  return parseYaml(readFileSync(path, 'utf-8'));
}

// ─────────────────────────────────────────────
// Title filter
// ─────────────────────────────────────────────

function matchesTitleFilter(title, filter) {
  if (!filter) return true;
  const t = (title || '').toLowerCase();
  const positive = (filter.positive || []).map((s) => String(s).toLowerCase());
  const negative = (filter.negative || []).map((s) => String(s).toLowerCase());

  if (positive.length > 0) {
    const hit = positive.some((p) => t.includes(p));
    if (!hit) return false;
  }
  if (negative.some((n) => t.includes(n))) return false;
  return true;
}

// ─────────────────────────────────────────────
// Mode B — API
// ─────────────────────────────────────────────

async function scanViaApi(queries, titleFilter, token, userAgent) {
  console.log(`[scan-hh] mode: api (using bearer token)`);
  const results = [];

  for (const q of queries) {
    if (q.enabled === false) continue;
    const params = new URLSearchParams();
    params.set('text', q.text);
    if (q.area != null) params.set('area', String(q.area));
    if (q.experience) params.set('experience', q.experience);
    if (q.schedule) params.set('schedule', q.schedule);
    params.set('per_page', '100');

    const url = `https://api.hh.ru/vacancies?${params.toString()}`;
    console.log(`[scan-hh] [api] ${q.name || q.text}`);

    let resp;
    try {
      resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': userAgent,
        },
      });
    } catch (e) {
      console.error(`[scan-hh] network error: ${e.message}`);
      continue;
    }

    if (resp.status === 401 || resp.status === 403) {
      console.error(
        `[scan-hh] FATAL: hh_api_token invalid or expired (HTTP ${resp.status}). ` +
          `Refresh your token at https://dev.hh.ru/admin and update config/profile.yml.`
      );
      process.exit(2);
    }
    if (!resp.ok) {
      console.error(`[scan-hh] HTTP ${resp.status} for ${q.name || q.text}, skipping`);
      continue;
    }

    const data = await resp.json();
    const items = data.items || [];
    for (const v of items) {
      const title = v.name || '';
      if (!matchesTitleFilter(title, titleFilter)) continue;
      results.push({
        source: 'api',
        query: q.name || q.text,
        id: v.id,
        title,
        company: v.employer?.name || null,
        url: v.alternate_url || null,
        area: v.area?.name || null,
        salary: v.salary || null,
        schedule: v.schedule?.id || null,
        experience: v.experience?.id || null,
        published_at: v.published_at || null,
        snippet: v.snippet || null,
      });
    }

    // Throttle
    await sleep(350); // ~3 req/sec
  }

  return results;
}

// ─────────────────────────────────────────────
// Mode A — Playwright (default)
// ─────────────────────────────────────────────

async function scanViaPlaywright(queries, titleFilter) {
  console.log(`[scan-hh] mode: playwright (no hh_api_token in profile)`);
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    locale: 'ru-RU',
  });
  const page = await context.newPage();

  const results = [];

  try {
    for (const q of queries) {
      if (q.enabled === false) continue;
      const params = new URLSearchParams();
      params.set('text', q.text);
      if (q.area != null) params.set('area', String(q.area));
      if (q.experience) params.set('experience', q.experience);
      if (q.schedule) params.set('schedule', q.schedule);
      params.set('items_on_page', '50');

      const url = `https://hh.ru/search/vacancy?${params.toString()}`;
      console.log(`[scan-hh] [pw] ${q.name || q.text} → ${url}`);

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(2000);
      } catch (e) {
        console.error(`[scan-hh] navigation error: ${e.message}`);
        continue;
      }

      // Parse cards using stable data-qa attributes where possible
      const cards = await page.evaluate(() => {
        const out = [];
        // HH uses data-qa="vacancy-serp__vacancy" for each card historically
        const nodes = document.querySelectorAll(
          '[data-qa="vacancy-serp__vacancy"], [data-qa="serp-item__title"], article[data-qa*="vacancy"]'
        );
        // Fallback: try generic article cards
        const scope = nodes.length > 0 ? nodes : document.querySelectorAll('div[class*="vacancy-card"]');
        scope.forEach((el) => {
          const titleEl = el.querySelector(
            '[data-qa="serp-item__title"], a[data-qa="vacancy-serp__vacancy-title"], h2 a'
          );
          const companyEl = el.querySelector(
            '[data-qa="vacancy-serp__vacancy-employer"], [data-qa="vacancy-serp__vacancy-employer-text"]'
          );
          const salaryEl = el.querySelector(
            '[data-qa="vacancy-serp__vacancy-compensation"]'
          );
          const areaEl = el.querySelector(
            '[data-qa="vacancy-serp__vacancy-address"]'
          );
          const snippetEl = el.querySelector(
            '[data-qa="vacancy-serp__vacancy_snippet_responsibility"], [data-qa="vacancy-serp__vacancy_snippet_requirement"]'
          );

          if (!titleEl) return;
          out.push({
            title: titleEl.textContent?.trim() || '',
            url: titleEl.href || null,
            company: companyEl?.textContent?.trim() || null,
            salary: salaryEl?.textContent?.trim() || null,
            area: areaEl?.textContent?.trim() || null,
            snippet: snippetEl?.textContent?.trim() || null,
          });
        });
        return out;
      });

      if (cards.length === 0) {
        console.error(
          `[scan-hh] WARNING: 0 cards parsed for "${q.name || q.text}". ` +
            `HH.ru DOM may have changed — check stable data-qa attributes.`
        );
      }

      for (const c of cards) {
        if (!matchesTitleFilter(c.title, titleFilter)) continue;
        results.push({
          source: 'playwright',
          query: q.name || q.text,
          id: extractIdFromUrl(c.url),
          title: c.title,
          company: c.company,
          url: c.url,
          area: c.area,
          salary: c.salary,
          snippet: c.snippet,
        });
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

function extractIdFromUrl(url) {
  if (!url) return null;
  const m = url.match(/\/vacancy\/(\d+)/);
  return m ? m[1] : null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const profile = loadProfile();
  const portals = loadPortals();

  const hh_queries = portals.hh_queries || [];
  const title_filter = portals.title_filter || {};

  if (hh_queries.length === 0) {
    console.error(
      '[scan-hh] No hh_queries defined in portals.yml. ' +
        'Add a section like:\n\n' +
        '  hh_queries:\n' +
        '    - name: "Москва AI Engineer"\n' +
        '      text: "AI Engineer"\n' +
        '      area: 1\n' +
        '      enabled: true\n'
    );
    process.exit(1);
  }

  const enabledQueries = hh_queries.filter((q) => q.enabled !== false);
  if (enabledQueries.length === 0) {
    console.error('[scan-hh] All hh_queries are disabled. Set enabled: true on at least one.');
    process.exit(1);
  }

  const token = profile.candidate?.hh_api_token || profile.hh_api_token || null;

  let results;
  if (token) {
    const contact =
      profile.candidate?.email ||
      profile.candidate?.full_name ||
      'unknown';
    const userAgent = `career-ops-ru/1.0 (${contact})`;
    results = await scanViaApi(enabledQueries, title_filter, token, userAgent);
  } else {
    results = await scanViaPlaywright(enabledQueries, title_filter);
  }

  console.log(`[scan-hh] total results after title_filter: ${results.length}`);

  if (dryRun) {
    console.log('[scan-hh] --dry-run: not writing output');
    return;
  }

  // Write jsonl
  const dataDir = join(PROJECT_ROOT, 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const outPath = join(dataDir, `hh-scan-${today}.jsonl`);
  const body = results.map((r) => JSON.stringify(r)).join('\n') + '\n';
  writeFileSync(outPath, body, 'utf-8');
  console.log(`[scan-hh] wrote ${results.length} rows → ${outPath}`);
}

main().catch((e) => {
  console.error(`[scan-hh] fatal: ${e.stack || e.message || e}`);
  process.exit(1);
});
