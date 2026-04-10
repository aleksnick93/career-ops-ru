# Career-Ops RU

[Русский](README.md) | [English (original)](https://github.com/santifer/career-ops)

<p align="center">
  <a href="https://t.me/webchamp_public"><img src="docs/career-ops-ru-banner.jpg" alt="Мультиагентная AI-система поиска работы Career-Ops для российского рынка труда" width="800"></a>
</p>

<p align="center">
  Компании используют AI для автофильтрации кандидатов. <strong>Я дал кандидатам AI, чтобы они <em>сами выбирали компании</em>.</strong>
  Форк оригинального career-ops, адаптированный под российский рынок труда.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white" alt="Claude Code">
  <img src="https://img.shields.io/badge/OpenCode-111827?style=flat&logo=terminal&logoColor=white" alt="OpenCode">
  <img src="https://img.shields.io/badge/Codex_(soon)-6B7280?style=flat&logo=openai&logoColor=white" alt="Codex">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT">
  <br>
  <img src="https://img.shields.io/badge/RU-1C3FAA?style=flat" alt="RU">
  <img src="https://img.shields.io/badge/EN-blue?style=flat" alt="EN">
</p>

---

<p align="center">
  <img src="docs/demo.gif" alt="Career-Ops Demo" width="800">
</p>

<p align="center"><strong>Форк Сareer-OPS · Адаптация под HH, Habr.Карьера, GetMatch · Русскоязычные промпты и архетипы</strong></p>

## Что это такое

Career-Ops RU превращает Claude Code в полноценный командный центр поиска работы на российском рынке и в СНГ.
Вместо ручного отслеживания откликов в таблицах — AI-пайплайн, который:

- **Оценивает вакансии** по системе A–F с учётом 22 архетипов (AI, ML, Data, Dev, Lead, Product, QA, BA, SA, DA)
- **Фильтрует опасные офферы** — opt-in каталог из 16 red flags (серая зарплата, ГПХ на постоянку, переработки, вакационный минимум, задержки выплат)
- **Генерирует PDF-резюме** — ATS-оптимизированные, адаптированные под конкретную вакансию
- **Сканирует рынок РФ и СНГ** — hh.ru (структурированный scanner), Habr Career, getmatch.ru, dev.by, hh.kz, staff.am, jobs.ge, hh.uz + международные Greenhouse, Ashby, Lever
- **Считает зарплату по 6 странам** — RU, BY, KZ, AM, GE, UZ с учётом льготных IT-режимов (ПВТ, Astana Hub, IT Park, Virtual Zone) и курса ЦБ
- **Пакетная обработка** — оценка 10+ вакансий параллельно через sub-agents
- **Трекер вакансий** — единая база с дедупликацией и проверкой целостности

> **Важно: это НЕ инструмент для массовой рассылки откликов.** Career-ops — это фильтр.
> Он помогает найти 3–5 вакансий в неделю, которые реально стоят вашего времени из сотен доступных.
> Система настоятельно рекомендует не откликаться на вакансии со скором ниже 4.0/5.

> **Первые оценки будут неточными.** Система ещё вас не знает. Добавьте контекст: cv.md, карьерную историю, доказательства достижений, предпочтения. Чем больше вы её «обучаете», тем точнее становятся оценки — как стажёр-рекрутер в первую неделю.

> **Всегда проверяйте контент перед отправкой — финальное решение за вами!**


## Для кого

- **IT-специалисты**, ищущие работу на российском и международном рынке
- **AI-инженеры, разработчики, продакт-менеджеры** - архетипы настраиваются под любую специализацию
- **Всем, кто устал от ручного трекинга** - вместо таблиц Excel и заметок в Notion один AI-пайплайн
- **Всем, кто ценит качество, а не количество** - система помогает выбирать, а не спамить откликами


## Возможности

| Возможности | Описание |
|---------|-------------|
| **Авто-пайплайн** | Вставь URL — получишь полную оценку, PDF-резюме и запись в трекер |
| **Оценка по 6 блокам** | Резюме роли, соответствие CV, уровень и стратегия, компенсация, персонализация, подготовка к интервью (STAR+R) |
| **22 архетипа в 5 семьях** | AI-специалисты, ML/Data, Разработка, Лидерство/Архитектура, Продукт/Проекты/QA/BA/SA/DA — покрывает весь спектр IT-ролей |
| **Personal Filter Overrides** | Любой архетип можно исключить лично под себя в `modes/_profile.md` — системные файлы не трогаются |
| **Каталог red flags (opt-in)** | 16 флагов: серая зарплата, ГПХ на постоянку, отпуск <28 дней, испытательный срок >3 мес, переработки, outstaff, задержки выплат. Кандидат включает то, что важно именно ему |
| **Банк STAR-историй** | Накапливает STAR+Reflection истории из всех оценок — 5–10 мастер-историй под любой поведенческий вопрос |
| **Скрипты переговоров** | Фреймворки для торга по зарплате, пушбэк против «географической скидки», рычаги конкурирующих офферов |
| **Генерация ATS PDF** | Резюме с keyword-инъекцией, шрифты Space Grotesk + DM Sans, поддержка кириллицы |
| **Сканер порталов** | 55+ компаний предустановлено + структурированный `scan-hh.mjs` для hh.ru + запросы по Ashby, Greenhouse, Lever, Workable, Wellfound |
| **hh.ru scanner (Playwright/API)** | Двухрежимный: Playwright по умолчанию (без ключа), API — опционально с токеном из dev.hh.ru/admin. Читает `key_skills` и опыт структурированно |
| **Поддержка СНГ** | Беларусь, Казахстан, Армения, Грузия, Узбекистан — компании, порталы, налоговые режимы. Включается флагом `cis_companies_enabled` |
| **Зарплатный скоринг RU+СНГ** | Сравнение gross/net с учётом НДФЛ 13% и льготных режимов (ПВТ BY 9%, Astana Hub KZ 0%, AM IT 10%, GE Virtual Zone 1%, UZ IT Park 7.5%). Конверсия по курсу ЦБ РФ |
| **Tagging релокации** | Все компании промаркированы (`yes_explicit` / `yes_historical` / `hard_block` / `unknown`) — сразу видно, кто возьмёт с российским паспортом |
| **Чёрный список работодателей** | Секция `blocked_employers` с источником и датой добавления. Scan/eval пропускают автоматически или помечают как hard flag |
| **Пакетная обработка** | Параллельная оценка через воркеры `claude -p` |
| **Терминальный дашборд** | Go TUI для просмотра, фильтрации и сортировки пайплайна |
| **Human-in-the-Loop** | AI оценивает и рекомендует — ты решаешь и действуешь. Система НИКОГДА не отправляет отклик сама |
| **Проверка целостности** | Автомердж TSV, дедупликация, нормализация статусов (с русскими алиасами), health-чеки |
| **Русскоязычные промпты** | Режимы `modes/ru/` по умолчанию: `vakansiya.md`, `otliknutsya.md`, `pipeline.md` |
| **Российские компании** | Yandex, Sber, Tinkoff, VK, Avito, Ozon, JetBrains, Kaspersky + Wargaming BY, Kaspi KZ, PicsArt AM, TBC GE, Uzum UZ |


## Специфика российского рынка и СНГ

Скоринг учитывает реалии, которых нет в оригинальной EN-версии:

| Что учитывает | Зачем |
|---|---|
| **КТК / ГПХ / ИП / Самозанятый** | Разные формы занятости — разные гарантии. Система пересчитывает ГПХ-ставку в эквивалент КТК для корректного сравнения |
| **Белая / серая зарплата** | Серая зарплата = red flag в скоринге (трудности с кредитами, отсутствие пенсионного стажа) |
| **ДМС** | Ключевой бенефит в РФ. Отсутствие ДМС в крупной компании снижает оценку |
| **Gross / Net (НДФЛ 13%)** | В объявлениях часто указывают gross. Система пересчитывает: net = gross × 0.87 (15% для дохода > 5 млн ₽/год) |
| **Отпуск по ст.115 ТК РФ** | Минимум 28 календарных дней — меньше это red flag |
| **Испытательный срок** | 3 месяца — норма. Больше для линейных специалистов — флаг |
| **IT-аккредитация Минцифры** | Льготная ипотека, отсрочка от армии, пониженные страховые взносы. Проверка отсрочки — **opt-in** и только при явном согласии кандидата |
| **Опционы / RSU / ESOP** | Проверка vesting, cliff, ликвидности для tech-компаний |
| **Льготные режимы СНГ** | BY ПВТ (9%), KZ Astana Hub (0%), AM IT-сертификат (10%), GE Virtual Zone (1%), UZ IT Park (7.5%) |
| **Санкционные блокеры** | Компании под SDN помечены `relocation_friendly: hard_block` — система предупредит перед откликом |

## Требования

| Компонент | Версия | Назначение |
|---|---|---|
| [Claude Code](https://claude.ai/code) или [OpenCode](https://opencode.ai) | — | AI-агент, ядро системы |
| [Node.js](https://nodejs.org/) | 18+ | PDF-генерация, утилиты |
| [Playwright](https://playwright.dev/) | — | Рендеринг PDF, скрапинг порталов |
| [Go](https://go.dev/) | 1.21+ | *(опционально)* Дашборд |

## Быстрый старт

```bash
# 1. Клонировать и установить
git clone https://github.com/aleksnick93/career-ops-ru.git
cd career-ops-ru && npm install
npx playwright install chromium   # нужен для генерации PDF

# 2. Проверить установку
npm run doctor

# 3. Настроить профиль
cp config/profile.example.yml config/profile.yml   # заполнить своими данными
cp templates/portals.example.yml portals.yml        # настроить компании

# 4. Добавить резюме
# Создать cv.md в корне проекта (markdown-формат)

# 5. Создать файл трекера
mkdir -p data && touch data/applications.md

# 6. Персонализировать через Claude Code или OpenCode
claude   # или opencode — открыть в этой папке

# Примеры запросов к Claude:
# "Добавь вакансии с hh.ru в portals.yml"
# "Переведи все архетипы под AI-инженера"
# "Обнови мой профиль на основе этого резюме"
# "Добавь Яндекс и Сбер в список компаний"

# 7. Начать работу
# Вставить URL вакансии или запустить /career-ops
```

> **Система сделана так, чтобы её адаптировал сам Claude.** Режимы, архетипы, веса скоринга, скрипты переговоров — просто попросите Claude изменить их. Он читает те же файлы, которые исполняет.

Подробная инструкция: [docs/SETUP.md](docs/SETUP.md)

## Онбординг за 5 минут

После клонирования и `npm install` запусти Claude Code или OpenCode в папке проекта — агент сам проведёт тебя по шагам. Но если хочется понять структуру заранее:

### Шаг 1. Резюме и профиль

```bash
# Положи свой CV в корень
cp <твой-cv>.md cv.md         # или попроси Claude преобразовать PDF/LinkedIn

# Скопируй шаблоны
cp config/profile.example.yml config/profile.yml
cp templates/portals.example.yml portals.yml
```

Открой [config/profile.yml](config/profile.yml) и заполни блок `candidate:` — имя, email, локация, Telegram, GitHub. Опционально: `gender: male|female|null` (нужно только для проверки IT-отсрочки) и `hh_api_token: null` (оставь как есть, если не регистрировал приложение на dev.hh.ru).

### Шаг 2. Скажи системе, КОГО ты ищешь

Claude первого запуска спросит, какие архетипы исключить. Ответы сохранятся в [modes/_profile.md](modes/_profile.md) в секцию `Personal Filter Overrides`. Пример:

```markdown
# Personal Filter Overrides
## Excluded archetypes
- #7 ML Engineer — не делаю training/MLOps, только AI-инженерия с готовыми LLM
- #11 Frontend (pure) — только fullstack

## Target archetypes
#1, #2, #3, #4, #5, #6, #8, #10, #12, #13, #14, #15, #16, #17, #18
```

**Без этой секции система оценит тебе ML- и QA-роли.** Полный каталог из 22 архетипов — в [modes/ru/_shared.md](modes/ru/_shared.md).

### Шаг 3. Включи нужные red flags

В том же [modes/_profile.md](modes/_profile.md) добавь блок `Active Red Flags`:

```yaml
active_red_flags:
  - gray_salary              # серая/конвертная зарплата
  - gph_for_permanent        # ГПХ вместо КТК
  - salary_delays_history    # зафиксированные задержки выплат
  - no_dms: -1.0             # отсутствие ДМС (override severity)
  - mandatory_overtime_culture
  - vacation_under_28_days
  - probation_over_3_months

mobilization_aware: false    # проверка IT-отсрочки РФ (только для мужчин)
consider_blacklisted: false  # автоматом скипать blocked_employers или помечать флагом
```

Полный каталог из 16 флагов с severity и применимостью по странам — в [modes/ru/_shared.md](modes/ru/_shared.md) → `RU/CIS Red Flags Catalog`.

### Шаг 4. Включи СНГ (опционально)

По умолчанию сканируется только РФ. Если рассматриваешь Беларусь/Казахстан/Армению/Грузию/Узбекистан:

```yaml
# В portals.yml на верхнем уровне
cis_companies_enabled: true
```

И активируй `enabled: true` у нужных СНГ-запросов и компаний в секциях `search_queries`, `hh_queries`, `tracked_companies` (Блок 9). Налоги по 6 странам уже лежат в [config/profile.yml](config/profile.yml) → `ru_cis_tax:`.

### Шаг 5. Первая оценка

```bash
claude                           # или opencode
# Вставь URL вакансии → получишь отчёт + PDF + запись в трекер
# Или запусти сканер:
npm run scan:hh                  # hh.ru structured scanner (Playwright default)
```

После первых 5–10 оценок скажи Claude: **«Этот скор слишком высокий, я бы не пошёл сюда, потому что X»**. Он обновит [modes/_profile.md](modes/_profile.md) или `article-digest.md` — и следующие оценки станут точнее. Система должна учиться от каждого твоего фидбэка.

### Чек-лист «всё готово»

- [ ] `cv.md` существует в корне
- [ ] `config/profile.yml` заполнен (candidate, target_roles)
- [ ] `portals.yml` существует (скопирован из templates)
- [ ] `modes/_profile.md` содержит `Personal Filter Overrides` и `Active Red Flags`
- [ ] `data/applications.md` создан (или будет создан при первой оценке)
- [ ] `npm run doctor` показывает 0 errors
- [ ] `npm run verify` показывает 0 errors


## Команды

Career-ops — одна slash-команда с множеством режимов. Работает в **Claude Code** и **[OpenCode](https://opencode.ai)**.

```
/career-ops                    → Показать все доступные команды
/career-ops {URL или текст}    → Полный пайплайн (оценка + PDF + трекер)
/career-ops scan               → Сканировать порталы на новые вакансии
/career-ops pdf                → Сгенерировать ATS-оптимизированное резюме
/career-ops batch              → Пакетная оценка 10+ вакансий
/career-ops tracker            → Просмотр статуса откликов
/career-ops apply              → Заполнение форм отклика через AI
/career-ops pipeline           → Обработать очередь URL
/career-ops contacto           → Сообщение для аутрича в LinkedIn / Telegram
/career-ops deep               → Глубокое исследование компании
/career-ops training           → Оценить курс или сертификат
/career-ops project            → Оценить проект из портфолио
/career-ops patterns           → Анализ паттернов отказов и улучшение таргетинга
```

Или просто вставьте URL вакансии или её текст — система автоматически определит и запустит полный пайплайн.

### npm-скрипты

```bash
npm run doctor         # Проверка окружения и файлов
npm run verify         # Health-check пайплайна (0 errors = всё ок)
npm run normalize      # Нормализация статусов в applications.md
npm run dedup          # Удаление дубликатов из трекера
npm run merge          # Смёрджить TSV из batch/tracker-additions/
npm run pdf            # Сгенерировать CV PDF из cv.md
npm run scan:hh        # Структурированный scanner hh.ru (Playwright или API)
npm run liveness       # Проверить, не закрыты ли вакансии в pipeline.md
npm run update:check   # Проверить обновления системы
npm run update         # Применить обновление (пользовательские файлы не трогаются)
```

> **OpenCode:** В OpenCode используются отдельные команды вместо аргументов — `/career-ops-scan`, `/career-ops-evaluate` и т.д. Полный список в `.opencode/commands/`.

## Как это работает

```
Вы вставляете URL или текст вакансии
              │
              ▼
   ┌──────────────────────┐
   │  Определение         │  1 из 22 архетипов в 5 семьях:
   │  Архетипа            │  AI · ML/Data · Dev · Lead/Arch · Product/PM/QA/BA/SA/DA
   └──────────┬───────────┘
              │
   ┌──────────▼───────────┐
   │  Personal Filter     │  Пропуск архетипов из modes/_profile.md
   │  Overrides           │  (например, #7 ML, #19 QA)
   └──────────┬───────────┘
              │
   ┌──────────▼───────────┐
   │  Оценка A–F          │  Соответствие CV, компенсация (с курсом ЦБ),
   │  (из cv.md)          │  personalization, pitch, interview prep
   └──────────┬───────────┘
              │
   ┌──────────▼───────────┐
   │  Red Flags Workflow  │  Сумма severity активных флагов
   │  (opt-in)            │  вычитается из Global score
   └──────────┬───────────┘
              │
         ┌────┼─────┐
         ▼    ▼     ▼
      Отчёт  PDF  Трекер
       .md  .pdf   .tsv
```

## Подключённые порталы

Сканер включает **68+ компаний** (55 базовых + 13 СНГ) и **25+ поисковых запросов** по основным российским, СНГ и международным площадкам. Скопируй `templates/portals.example.yml` в `portals.yml` и добавь свои компании.

### Российские компании
**AI-first:** Yandex AI/Cloud, Sber AI/GigaChat, VK Tech, Tinkoff Tech, Avito Tech, Ozon Tech

**Dev Tools:** JetBrains, Kaspersky Lab

### СНГ (включается `cis_companies_enabled: true`)
**Беларусь:** Wargaming, EPAM BY, iTechArt

**Казахстан:** Kaspi.kz, Beeline KZ Tech, BTS Digital

**Армения:** PicsArt, Krisp, ServiceTitan AM

**Грузия:** TBC Bank Tech, Bank of Georgia Tech

**Узбекистан:** Uzum, IT Park Uzbekistan

### Международные компании
**AI Labs:** Anthropic, OpenAI, Mistral, Cohere, Hugging Face, Perplexity

**Автоматизация:** n8n, Zapier, Make.com, Clay Labs

**AI Контент:** ElevenLabs, HeyGen, Synthesia, Runway, Black Forest Labs (FLUX)

**AI Infra/LLMOps:** LangChain, Langfuse, Pinecone, Arize AI, Weights & Biases

**Dev Platforms:** Vercel, Retool, Airtable, Lovable, WorkOS, Temporal

**Europe Remote:** Attio, Glean, Hightouch, Photoroom, Lindy

### Площадки для поиска
**Российские:** hh.ru (структурированный scanner), Habr Career, getmatch.ru

**СНГ:** dev.by, rabota.by, hh.kz, staff.am, jobs.ge, hh.uz

**Международные:** Ashby, Greenhouse, Lever, Wellfound, Workable

## Дашборд TUI

Встроенный дашборд для просмотра пайплайна в терминале:

```bash
cd dashboard
go build -o career-dashboard.exe .    # Windows
# go build -o career-dashboard .      # macOS / Linux
./career-dashboard.exe --path ..
```

Возможности: 6 вкладок-фильтров, 4 режима сортировки, группировка, предпросмотр, смена статуса.

## Структура проекта

```
career-ops-ru/
├── CLAUDE.md                    # Инструкции для агента (русская часть в ru/)
├── cv.md                        # Ваше резюме (создать)
├── article-digest.md            # Дайджест статей (опционально)
├── scan-hh.mjs                  # Структурированный scanner hh.ru (Tier 2.1)
├── config/
│   ├── profile.example.yml      # Шаблон профиля
│   └── profile.yml              # Личные данные + ru_cis_tax + hh_api_token
├── modes/
│   ├── _profile.md              # ВАША кастомизация (filter overrides, red flags)
│   ├── _shared.md               # Общий контекст (EN)
│   ├── oferta.md                # Оценка вакансии (EN)
│   ├── pdf.md                   # Генерация PDF
│   ├── scan.md                  # Сканер порталов (с Tier 4 hh.ru)
│   ├── batch.md                 # Пакетная обработка
│   └── ru/                      # Русские модули (default в RU-форке)
│       ├── _shared.md           # 22 архетипа + 16 red flags + RU/СНГ-контекст
│       ├── vakansiya.md         # Оценка вакансии A–F + filter check + D.1
│       ├── otliknutsya.md       # Ассистент заполнения форм
│       └── pipeline.md          # Инбокс URL
├── portals.yml                  # Конфиг сканера (создать из templates/)
├── templates/
│   ├── cv-template.html         # ATS-шаблон резюме (Space Grotesk + DM Sans)
│   ├── portals.example.yml      # RU/СНГ ready-to-go шаблон
│   └── states.yml               # Канонические статусы + русские алиасы
├── batch/
│   ├── batch-prompt.md          # Промпт воркера (с RU-источниками зарплат)
│   └── batch-runner.sh          # Оркестратор
├── dashboard/                   # Go TUI дашборд
├── data/
│   ├── applications.md          # Трекер откликов
│   ├── pipeline.md              # Очередь URL
│   ├── scan-history.tsv         # История сканирования
│   └── hh-scan-YYYYMMDD.jsonl   # Результаты scan-hh.mjs
├── reports/                     # Отчёты оценок
├── output/                      # Сгенерированные PDF
├── fonts/                       # Space Grotesk + DM Sans (кириллица)
├── docs/                        # Установка, настройка, архитектура
└── examples/                    # Образцы резюме, отчёты
```

### Ключевые файлы для персонализации

| Файл | Что там |
|---|---|
| [cv.md](cv.md) | Ваше резюме — единый источник правды |
| [config/profile.yml](config/profile.yml) | Контакты, target roles, налоги РФ/СНГ, опциональные `gender` и `hh_api_token` |
| [modes/_profile.md](modes/_profile.md) | Personal Filter Overrides + Active Red Flags — **никогда не перезаписывается апдейтами** |
| [portals.yml](portals.yml) | Компании, запросы, `cis_companies_enabled`, `blocked_employers` |

### Что обновлять НЕ нужно руками

`modes/ru/_shared.md`, `modes/ru/vakansiya.md`, `scan-hh.mjs`, всё в `templates/` — это системный слой. Он обновляется через `npm run update` без потери ваших данных.

## Технологический стек

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Bubble Tea](https://img.shields.io/badge/Bubble_Tea-FF75B5?style=flat&logo=go&logoColor=white)

- **Агент:** Claude Code / OpenCode с кастомными режимами и инструкциями
- **PDF:** Playwright + HTML-шаблон с кириллическими шрифтами (Space Grotesk + DM Sans)
- **Сканер:** Playwright (`scan-hh.mjs` default) + hh.ru API (opt-in с токеном) + Greenhouse API + WebSearch
- **Парсинг конфигов:** Hand-rolled YAML subset в `scan-hh.mjs` (без внешних зависимостей)
- **Дашборд:** Go + Bubble Tea + Lipgloss (тема Catppuccin Mocha)
- **Данные:** Markdown-таблицы + YAML-конфиги + TSV-файлы + JSONL для результатов сканера

## Об авторе форка

Меня зовут Александр - AI-инженер и fullstack-разработчик с 10+ летним опытом создания корпоративных систем с нуля.
Теперь создаю AI-системы на базе LLM и автоматизации: от архитектуры до прода за несколько дней.

Создатель Telegram-бота [@ai_photomaster_bot](https://t.me/ai_photomaster_bot) и других AI-инструментов.

## Оригинальный проект

Форк создан на базе **[career-ops by Santiago Fernández de Valderrama](https://github.com/santifer/career-ops)**.
Santiago - Head of Applied AI, использовал систему для оценки 740+ вакансий и получил оффер мечты.

[Читать кейс-стади](https://santifer.io/career-ops-system) · ☕ [Buy Santiago a coffee](https://buymeacoffee.com/santifer)

## Отказ от ответственности

**Сareer-OPS RU - локальный open-source инструмент, НЕ хостируемый сервис** 

Используя этот инструмент, вы подтверждаете:

1. **Ваши данные - у вас.** CV, контакты и персональные данные остаются на вашем устройстве и передаются только напрямую провайдеру AI (Anthropic, OpenAI и др.). Мы не собираем и не имеем доступа к вашим данным.
2. **Вы управляете AI.** Промпты по умолчанию запрещают автоматическую отправку откликов. **Всегда проверяйте AI-сгенерированный контент перед отправкой.**
3. **Вы соблюдаете ToS платформ.** Используйте инструмент в соответствии с правилами hh.ru, Habr Career, LinkedIn и других платформ. Не используйте для спама работодателям.
4. **Без гарантий.** Оценки — рекомендации, не истина. AI-модели могут галлюцинировать. Авторы не несут ответственности за исход трудоустройства.

Полные условия: [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md) · Лицензия: [MIT](LICENSE)

## Лицензия

MIT - форк оригинального [career-ops](https://github.com/santifer/career-ops) by Santiago Fernández de Valderrama.

## Связаться

[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/webchamp)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/webchamp)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aleksnick93)