# Режим: pipeline -- Инбокс URL (Second Brain)

Обрабатывает URL вакансий, накопленных в `data/pipeline.md`. Кандидат добавляет URL в любое время, а затем запускает `/career-ops pipeline` для обработки всех разом.

## Workflow

1. **Прочитать** `data/pipeline.md` → найти элементы `- [ ]` в секции "Ожидающие"
2. **Для каждого ожидающего URL**:
   a. Вычислить следующий `REPORT_NUM` (прочитать `reports/`, взять наибольший номер + 1)
   b. **Извлечь JD** через Playwright (browser_navigate + browser_snapshot) → WebFetch → WebSearch
   c. Если URL недоступен → пометить как `- [!]` с заметкой и продолжить
   d. **Выполнить полный auto-pipeline**: Оценка A-F → Report .md → PDF (если score >= 3.0) → Tracker
   e. **Переместить из "Ожидающие" в "Обработанные"**: `- [x] #NNN | URL | Компания | Роль | Score/5 | PDF ✅/❌`
3. **Если 3+ URL ожидают**, запустить агентов параллельно (Agent tool с `run_in_background`) для максимальной скорости.
4. **По завершении** показать сводную таблицу:

```
| # | Компания | Роль | Score | PDF | Рекомендуемое действие |
```

## Формат pipeline.md

```markdown
## Ожидающие
- [ ] https://jobs.example.com/posting/123
- [ ] https://boards.greenhouse.io/company/jobs/456 | Company Inc | Senior PM
- [!] https://private.url/job — Ошибка: требуется авторизация

## Обработанные
- [x] #143 | https://jobs.example.com/posting/789 | Acme Corp | AI PM | 4.2/5 | PDF ✅
- [x] #144 | https://boards.greenhouse.io/xyz/jobs/012 | BigCo | SA | 2.1/5 | PDF ❌
```

> Примечание: Заголовки секций могут быть на EN ("Pending"/"Processed"), ES ("Pendientes"/"Procesadas"), DE ("Offen"/"Verarbeitet"), PT-BR ("Pendentes"/"Processadas") или RU ("Ожидающие"/"Обработанные"). При чтении быть гибким; при записи сохранять стиль существующего файла.

## Умное извлечение JD из URL

1. **Playwright (предпочтительно):** `browser_navigate` + `browser_snapshot`. Работает со всеми SPA.
2. **WebFetch (fallback):** Для статических страниц или когда Playwright недоступен.
3. **WebSearch (крайний случай):** Искать на вторичных порталах, индексирующих JD.

**Особые случаи:**
- **LinkedIn**: Может требовать авторизацию → пометить `[!]` и попросить кандидата вставить текст
- **PDF**: Если URL ведёт на PDF, прочитать напрямую через Read tool
- **`local:` prefix**: Прочитать локальный файл. Пример: `local:jds/hh-senior-ai.md` → читать `jds/hh-senior-ai.md`
- **HH.ru (HeadHunter)**: Основная площадка для IT-вакансий в РФ. Playwright работает хорошо
- **Habr Career**: Могут быть cookie-баннеры, Playwright справляется через snapshot + scroll
- **SuperJob / Работа.ру**: Доступны через WebFetch
- **LinkedIn RU**: Те же ограничения, что и глобальный LinkedIn — может требовать авторизацию

## Автоматическая нумерация

1. Получить список всех файлов в `reports/`
2. Извлечь номер из префикса (напр.: `142-medispend...` → 142)
3. Новый номер = максимум + 1

## Синхронизация источников

Перед обработкой любого URL проверить синхронизацию:

```bash
node cv-sync-check.mjs
```

Если есть рассинхронизация, предупредить кандидата перед продолжением.
