import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { defaultLanguage, type Locale } from '$lib/shared/defaults';
import { resolveLegacyRedirect } from '$lib/shared/redirects';

const redirectLegacy: Handle = async ({ event, resolve }) => {
  const target = resolveLegacyRedirect(event.url.pathname);
  if (target) {
    throw redirect(301, target);
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
