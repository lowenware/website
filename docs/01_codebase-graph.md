# Löwenware — Codebase Graph

AI-facing reference for `lowenware.com`. Read this before exploring the repo to avoid redundant discovery calls.

---

## Project identity

| Key        | Value                                                   |
| ---------- | ------------------------------------------------------- |
| Site name  | **Löwenware** (`siteName` in `defaults.ts`)             |
| Type       | Company / product marketing site with blog              |
| Languages  | `en` (default), `cs`                                    |
| Origin env | `process.env.ORIGIN` → fallback `http://localhost:3000` |

---

## Root layout

```
lowenware.com/
├── content/              # Markdown content (source of truth for pages)
├── docs/                 # AI & dev documentation
├── scripts/              # One-off utility scripts
├── src/                  # SvelteKit application
├── static/               # Public static assets
├── package.json
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Content tree (`content/`)

Markdown files consumed **server-side** by `src/lib/server/markdown/loader.ts`.  
Locale fallback: if `cs/` file is missing, loader falls back to `en/`.

```
content/
└── en/                   # Primary locale (cs/ exists but is currently empty)
    ├── about/
    │   ├── intro.md
    │   ├── how-we-work.md
    │   └── projects/     # One .md per project logo/name entry
    ├── blog/             # Posts named YYYYMMDD_slug.md  (10 posts)
    ├── community/        # Community link cards (ordered by prefix)
    ├── home/
    │   ├── hero.md
    │   ├── tagline.md
    │   ├── contact.md
    │   └── technologies/ # Technology cards (ordered by prefix)
    ├── legal/            # terms-of-use.md, privacy-statement.md
    └── products/
        ├── 10_lowenbooks.md   # ProductCard frontmatter
        ├── 20_dotrix.md
        ├── dotrix/            # Product detail subdirectory
        │   ├── index.md
        │   ├── highlights/
        │   └── faq.md
        └── lowenbooks/        # (same structure as dotrix/)
```

---

## Application source (`src/`)

### Entry points

| File                  | Role                                                                    |
| --------------------- | ----------------------------------------------------------------------- |
| `src/app.html`        | HTML shell — `%lang%` placeholder replaced by `transformPageChunk`      |
| `src/app.css`         | Global styles, Tailwind v4, Skeleton UI theme                           |
| `src/app.d.ts`        | SvelteKit ambient types                                                 |
| `src/hooks.server.ts` | Request pipeline: root redirect → legacy redirect → HTML lang injection |

### `hooks.server.ts` pipeline

1. **`rootRedirect`** — `/` → `/{defaultLanguage}/` (302)
2. **`redirectLegacy`** — pattern-based 301s via `resolveLegacyRedirect()`
3. **`setHtmlLang`** — injects `lang` param into `%lang%` in `app.html`

---

## `src/lib/` — Library modules

### `src/lib/api/` — API contracts (client + server safe)

| File       | Exports                                                             |
| ---------- | ------------------------------------------------------------------- |
| `index.ts` | `ApiResponse<T>`, `ApiFieldError`, `ApiErrorCode`, `ok()`, `fail()` |

### `src/lib/server/` — Server-only modules

#### Markdown (`markdown/`)

| File          | Exports / role                                                                                                                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loader.ts`   | `loadMarkdownFile()`, `listMarkdownFiles()`, `listMarkdownSubdirs()` — reads `content/`, falls back to `en/`                                                                                                                                    |
| `parser.ts`   | Wraps `marked` — `parseMarkdown(content) → HTML string`                                                                                                                                                                                         |
| `sanitize.ts` | Wraps DOMPurify — `sanitizeHtml(html) → safe HTML string`                                                                                                                                                                                       |
| `home.ts`     | High-level loaders: `loadHomePage()`, `loadBlogPosts()`, `loadBlogPost()`, `loadBlogPostsByTag()`, `loadProductCards()`, `loadProductPage()`, `loadLegalPage()`, `loadCommunityLinks()`, `paginatePosts()`, `getAllBlogSlugs()`, `getAllTags()` |
| `index.ts`    | Re-exports all of the above                                                                                                                                                                                                                     |

### `src/lib/shared/` — Isomorphic utilities

| File                      | Exports                                                                                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `defaults.ts`             | `siteName`, `supportedLanguages`, `defaultLanguage`, `contentRoot`, `contentExtension`, `homeConfig`, `blogConfig`, `origin`, `isValidLocale()`                                                        |
| `paths.ts`                | Route constants (`HOME_PAGE`, `BLOG_PAGE`, `BLOG_POST_PAGE`, `BLOG_TAG_PAGE`, `DOTRIX_PAGE`, `LOWENBOOKS_PAGE`, `PRIVACY_PAGE`, `TERMS_PAGE`), `generatePath()`, `switchLocalePath()`, `absoluteUrl()` |
| `redirects.ts`            | `resolveLegacyRedirect(pathname)` — maps old URL patterns to new paths                                                                                                                                 |
| `seo.ts`                  | JSON-LD builders: `organizationJsonLd()`, `webSiteJsonLd()`, `blogPostingJsonLd()`, `softwareApplicationJsonLd()`, `buildAlternates()`                                                                 |
| `markdown/types.ts`       | `LoadedMarkdown<TMeta>`, `BlogPostMeta`, `BlogPost`, `ProductCard`, `ProductPage`                                                                                                                      |
| `markdown/frontmatter.ts` | Zod schemas: `HeroFrontmatterSchema`, `BlogPostFrontmatterSchema`, `ProductCardFrontmatterSchema`, `ProjectFrontmatterSchema`, `TechnologyFrontmatterSchema`, `LegalFrontmatterSchema`                 |
| `markdown/slug.ts`        | `parseBlogFilename()`, `parseOrderPrefix()`, `normalizeTags()`                                                                                                                                         |
| `markdown/index.ts`       | Re-exports all shared markdown helpers + types                                                                                                                                                         |

### `src/lib/i18n/`

| File       | Role                                                       |
| ---------- | ---------------------------------------------------------- |
| `index.ts` | svelte-i18n setup — `register()`, `init()`, `waitLocale()` |

Translation files: `src/lang/en.json`, `src/lang/cs.json`

### `src/lib/ui/` — Svelte UI components

| Folder      | Contents                                                 |
| ----------- | -------------------------------------------------------- |
| `toolkit/`  | `button.svelte`, `lang-toggle.svelte`, `seo-head.svelte` |
| `template/` | `blog-card.svelte`, `product-card.svelte`                |
| `layout/`   | `site-header.svelte`, `site-footer.svelte`               |

---

## Routes (`src/routes/`)

### Route map

```
src/routes/
├── +layout.svelte                          # Root layout (i18n init)
├── (app)/
│   └── [lang]/
│       ├── +layout.server.ts               # Loads session/lang for all pages
│       ├── +layout.ts                      # waitLocale()
│       ├── +layout.svelte                  # App chrome (header, footer)
│       ├── +page.server.ts                 # Home: loadHomePage()
│       ├── +page.svelte                    # Home page
│       ├── blog/
│       │   ├── +page.server.ts             # Blog list: loadBlogPosts() + paginatePosts()
│       │   ├── +page.svelte
│       │   ├── [slug]/
│       │   │   ├── +page.server.ts         # Single post: loadBlogPost()
│       │   │   └── +page.svelte
│       │   └── tags/[tag]/
│       │       └── (page files)            # Tag-filtered list: loadBlogPostsByTag()
│       ├── dotrix/
│       │   ├── +page.server.ts             # loadProductPage('dotrix')
│       │   └── +page.svelte
│       ├── lowenbooks/
│       │   ├── +page.server.ts             # loadProductPage('lowenbooks')
│       │   └── +page.svelte
│       ├── privacy-statement/
│       │   ├── +page.server.ts             # loadLegalPage('privacy-statement')
│       │   └── +page.svelte
│       └── terms-of-use/
│           ├── +page.server.ts             # loadLegalPage('terms-of-use')
│           └── +page.svelte
└── sitemap.xml/
    └── +server.ts                          # Dynamic XML sitemap
```

### API endpoints

| Method + Path      | Handler file                    | What it does                        |
| ------------------ | ------------------------------- | ----------------------------------- |
| `GET /sitemap.xml` | `routes/sitemap.xml/+server.ts` | Returns XML sitemap for all locales |

---

## Static assets (`static/`)

| Path                        | Contents                  |
| --------------------------- | ------------------------- |
| `static/blog/`              | Blog post images          |
| `static/dotrix/`            | Dotrix product images     |
| `static/projects/`          | Project logo images       |
| `static/slides/`            | Slide/presentation assets |
| `static/font/`              | Self-hosted web fonts     |
| `static/icons/`             | Icon assets               |
| `static/logo.svg`           | Main logo                 |
| `static/lowenware-logo.svg` | Alternative logo variant  |
| `static/robots.txt`         | Crawler rules             |

---

## Scripts (`scripts/`)

| File                          | Purpose                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| `generate-nginx-redirects.ts` | Generates nginx redirect config from `src/lib/shared/redirects.ts` |

---

## Environment variables

| Variable | Used in       | Purpose                              |
| -------- | ------------- | ------------------------------------ |
| `ORIGIN` | `defaults.ts` | Public site origin for absolute URLs |

---

## Key data-flow patterns

### Page rendering (Markdown-driven)

```
+page.server.ts
  → loadXxxPage(lang)          [src/lib/server/markdown/home.ts]
    → loadMarkdownFile(lang, ...parts)  [loader.ts]
      → fs.readFile(content/{lang}/...)
      → gray-matter (frontmatter)
      → parseMarkdown()  [marked]
      → sanitizeHtml()   [DOMPurify]
    → ZodSchema.parse(meta)
  → returns typed data to +page.svelte
```

---

## Conventions & rules

- **Locale fallback**: content loader always falls back to `en/` if the requested locale file is missing.
- **Markdown pipeline**: raw file → gray-matter → marked → DOMPurify → `{@html}` in Svelte.
- **Blog filenames** follow `YYYYMMDD_slug.md`; parsed by `parseBlogFilename()`.
- **Product/tech ordering** uses numeric filename prefix (`10_`, `20_`) parsed by `parseOrderPrefix()`; overridable via frontmatter `order` field.
- **Path constants** all live in `$lib/shared/paths.ts`; use `generatePath(template, params)` for substitution.
- **JSON-LD** builders live in `$lib/shared/seo.ts`; used in `seo-head.svelte`.
