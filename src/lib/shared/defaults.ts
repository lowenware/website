export const siteName = 'Löwenware';

export const supportedLanguages = ['en', 'cs'] as const;
export type Locale = (typeof supportedLanguages)[number];
export const defaultLanguage: Locale = 'en';

/** Locales with real translated content (used for hreflang/sitemap). */
export const publishedLocales = ['en'] as const satisfies readonly Locale[];

export const contentRoot = 'content';
export const contentExtension = '.md';

export const homeConfig = {
  maxBlogPosts: 3,
  maxFeaturedWork: 3
};

export const blogConfig = {
  postsPerPage: 9
};

export const origin =
  typeof process !== 'undefined' && process.env?.ORIGIN
    ? process.env.ORIGIN
    : 'http://localhost:3000';

export function isValidLocale(value: string): value is Locale {
  return (supportedLanguages as readonly string[]).includes(value);
}
