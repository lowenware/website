# Löwenware.com

SvelteKit 2 website for [Löwenware](https://lowenware.com) — single-page home with localized routes, blog, and product pages.

## Stack

- **SvelteKit 2** + **Svelte 5** + **TypeScript**
- **@sveltejs/adapter-static** (fully prerendered static site in `build/`)
- **Tailwind CSS 4** + **Skeleton UI 3**
- **svelte-i18n** (EN / CS — CS content falls back to EN until translated)

## Quick start

```bash
cp .env.example .env
npm install
npm run dev                   # http://localhost:3000
```

## Scripts

| Script                    | Description                            |
| ------------------------- | -------------------------------------- |
| `npm run dev`             | Development server                     |
| `npm run build`           | Production static build (`build/`)     |
| `npm run preview`         | Preview production build               |
| `npm run check`           | TypeScript / Svelte checks             |
| `npm run lint`            | Prettier + ESLint                      |
| `npm run lint:md`         | Markdownlint on `content/`             |
| `npm run redirects:nginx` | Generate `deploy/nginx-redirects.conf` |

## Project layout

- `content/en/` — English markdown (blog posts: `YYYYMMDD_{slug}.md`)
- `content/cs/` — Reserved for Czech content (empty; EN fallback active)
- `old/` — Legacy Next.js site (reference only)
- `src/lib/server/markdown/` — Markdown pipeline + domain loaders
- `src/lib/shared/redirects.ts` — Legacy URL redirect map

## Routes

| URL               | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `/en/`            | Home (About, Products, Technologies, Blog preview, Contact) |
| `/en/dotrix/`     | Dotrix product page                                         |
| `/en/lowenbooks/` | Löwenbooks placeholder                                      |
| `/en/blog/`       | Blog listing                                                |

Legacy URLs (e.g. `/dotrix/`, `/about/`) redirect to new EN routes via `deploy/nginx-redirects.conf` on the production nginx host. A root `static/index.html` redirects `/` to `/en/` when served as static files.

## Deployment

CI builds a static site with `npm run build` and deploys the `build/` directory via rsync (see `.github/workflows/`). Production nginx must include `deploy/nginx-redirects.conf` for legacy path redirects and `/` → `/en/`.

## Environment

See [`.env.example`](.env.example) for `ORIGIN`.
