# Noobs Basketball Club

React + Vite project for the Noobs basketball team entering Basketaki The League.

## Current stack

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.14.0`
- Vite `8.0.5`
- `@vitejs/plugin-react` `6.0.1`

These versions were checked against the npm registry on `2026-04-07`.

## Features

- Modern homepage with hero, standings, latest scores, countdown, sponsor visibility, roster modal, news, and Instagram section
- Uploaded club, sponsor, and league organizer assets wired into the UI
- Custom `404`, `cookies`, `privacy`, and `terms` routes
- Cookie banner and floating scroll-to-top button
- `/admin` page for editing the content model locally
- Local storage repository abstraction so you can replace it with Supabase later
- Salma Pro font loaded globally from the provided archive

## Local development

1. Install Node.js 20+.
2. Run `npm install`.
3. Run `npm run dev`.
4. Build with `npm run build`.

## Supabase handoff

The app currently uses `src/data/siteRepository.js` as the data boundary. To move to Supabase:

1. Create the tables you need for site settings, standings, matches, players, news, and Instagram posts.
2. Replace the `load`, `save`, and `reset` methods in `src/data/siteRepository.js`.
3. Add your keys to `.env.local` using `.env.example` as the template.
4. Keep the admin UI unchanged and let it talk to the new repository implementation.
