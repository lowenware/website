import type { Locale } from '$lib/shared/defaults';

export const HOME_PAGE = '/[lang]/';
export const BLOG_PAGE = '/[lang]/blog/';
export const BLOG_POST_PAGE = '/[lang]/blog/[slug]/';
export const BLOG_TAG_PAGE = '/[lang]/blog/tags/[tag]/';
export const DOTRIX_PAGE = '/[lang]/dotrix/';
export const LOWENBOOKS_PAGE = '/[lang]/lowenbooks/';

export function generatePath(template: string, params: Record<string, string> = {}): string {
  return template.replace(/\[(\w+)]/g, (_, key: string) => params[key] ?? `[${key}]`);
}

export function switchLocalePath(pathname: string, lang: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${lang}/`;
  if (segments[0] === 'en' || segments[0] === 'cs') {
    segments[0] = lang;
  } else {
    segments.unshift(lang);
  }
  const joined = `/${segments.join('/')}`;
  return joined.endsWith('/') ? joined : `${joined}/`;
}

export function absoluteUrl(path: string, origin: string): string {
  const base = origin.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
