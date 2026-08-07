# Шестнадцать

Фотолаборатория в Калуге — лендинг с заявкой на проявку плёнки и простой админ-панелью на Astro + Supabase.

## Стек

- **Astro 7** (SSR, `@astrojs/node`)
- **Supabase** — таблица `film_requests`
- **Админ** — один секретный ключ (`ADMIN_SECRET`), cookie-сессия

## Быстрый старт (без Supabase)

```bash
cp .env.example .env
# ADMIN_SECRET=... и DATA_STORE=memory уже достаточно для демо
npm install
npm run dev
```

- Сайт: http://localhost:4321/
- Админ: http://localhost:4321/admin/login — ключ из `ADMIN_SECRET`

В режиме `DATA_STORE=memory` заявки живут в памяти процесса.

## Supabase

1. Создайте проект и выполните SQL из `supabase/schema.sql`.
2. В `.env`:

```env
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_SECRET=длинный-случайный-секрет
# DATA_STORE не указывайте (или не ставьте memory)
```

3. `npm run dev` или `npm run build && npm start`.

Публичная форма пишет через серверный API; чтение/правка/удаление — только для авторизованного админа (service role на сервере).

## Страницы

| Путь | Назначение |
| --- | --- |
| `/` | Лендинг + форма заявки |
| `/admin/login` | Вход по секрету |
| `/admin` | Список заявок, статус, заметки, удаление |

## Дизайн

Визуальная база — editorial-система исходного Astro Keel (Fraunces / Public Sans, hairline-сетка), пересобранная под бренд **Шестнадцать**: акцент на имени, плёночная плоскость в герое, русскоязычный UI.
