import { redirect } from '@sveltejs/kit';
import { sequence, type Handle } from '@sveltejs/kit/hooks';
import { defaultLanguage, type Locale } from '#lib/shared/defaults.ts';
import { resolveLegacyRedirect } from '#lib/shared/redirects.ts';

const redirectLegacy: Handle = async ({ event, resolve }) => {
  const target = resolveLegacyRedirect(event.url.pathname);
  if (target) {
    const external = /^https?:\/\//.test(target);
    throw redirect(301, target, external ? { external: true } : undefined);
  }
  return resolve(event);
};

const setHtmlLang: Handle = async ({ event, resolve }) => {
  const lang = (event.params.lang as Locale | undefined) ?? defaultLanguage;
  return resolve(event, {
    transformPageChunk: ({ html, done }) => {
      if (!done) return html;
      return html.replace('%lang%', lang);
    }
  });
};

export const handle = sequence(redirectLegacy, setHtmlLang);
