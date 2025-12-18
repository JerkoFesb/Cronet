# Copilot instructions for CroNet ✅

Keep this short and actionable. Focus on what helps an AI get productive quickly in this repo.

## Quick start 🔧
- Run locally: `npm run dev` (starts Next 15 with Turbopack)
- Build: `npm run build` (uses `--turbopack`)
- Start: `npm start`

## Key files & architecture 🏗️
- `app/layout.tsx` — Root layout. Wraps children with `NuqsAdapter` and sets fonts.
- `app/_components/navigation.tsx` — Client component using `usePathname` for active link logic.
- `app/_components/Pagination.tsx` — Client component using `nuqs`'s `useQueryState` and `parseAsInteger`.
- `lib/blog-search-params.ts` — Server-side `createLoader` + `parseAsInteger` pattern for normalizing search params.
- `app/globals.css` — Tailwind imported (`@import "tailwindcss"`) and global vars.

## Project-specific conventions & patterns ⚙️
- App Router (Next `app/`) is used; prefer server components by default. Add `"use client"` at the top for client components.
- Query state uses `nuqs`:
  - Client: `useQueryState('page', parseAsInteger.withDefault(1))` (see `Pagination.tsx`).
  - Server: `createLoader(...)` in `lib/` to parse/validate search params (see `blog-search-params.ts`).
- Environment variables:
  - Use `.env.template` as canonical list (contains `PAGE_SIZE`, `BASE_API_URL`, `NEXT_PUBLIC_BASE_API_URL`).
  - `NEXT_PUBLIC_*` vars are the only ones accessible in client components (e.g., `Pagination.tsx` logs both to show this).
- Logging: `next.config.ts` removes `console.*` at compile time except `console.error` (add important logs via `console.error` to survive builds).
- Fonts are added via `next/font/google` in `layout.tsx` and exposed through CSS variables (`geistSans.variable`).
- TypeScript `paths` are configured in `tsconfig.json` (eg `@components/* -> ./app/_components/*`). Use existing patterns.

## External integration points 🔗
- `nuqs` (query-state + server parsing) — `NuqsAdapter` is mounted in `app/layout.tsx`.
- Back-end / API base URL values are stored in `BASE_API_URL` / `NEXT_PUBLIC_BASE_API_URL` (see `.env.template`).

## Developer workflow notes 📝
- No test harness or CI config present — be conservative and include manual testing steps in PRs.
- Keep PRs small and avoid introducing global runtime changes without a clear reason.

## When editing or adding pages 📄
- Create routes under `app/` (app-router). Use server components by default; use `"use client"` for interactive bits.
- For pagination & query params, prefer `nuqs` `useQueryState` (client) and `createLoader` (server).

## Examples (copyable) 💡
- Active nav pattern: `usePathname()` + `currentPath?.startsWith(page.path)` — see `app/_components/navigation.tsx`.
- Query loader example (server): `export const loadBlogSearchParams = createLoader(blogSearchParams)` — see `lib/blog-search-params.ts`.

If anything here is unclear or you want other details (tests, CI, deployment), tell me what to add and I'll iterate. ⚡
