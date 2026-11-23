import { browser } from '$app/env';
import { register, init, locale, waitLocale as waitLocaleStore } from 'svelte-i18n';
import { defaultLanguage, supportedLanguages, type Locale } from '#lib/shared/defaults.ts';

const loaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import('../../lang/en.json'),
  cs: () => import('../../lang/cs.json')
};

for (const lang of supportedLanguages) {
  register(lang, loaders[lang]);
}

let initialized = false;

export async function loadLocaleMessages(lang: Locale = defaultLanguage): Promise<void> {
  if (!initialized) {
    init({
      fallbackLocale: defaultLanguage,
      initialLocale: lang
    });
    initialized = true;
  }
  await waitLocaleStore(lang);
}

export async function activateLocale(lang: Locale = defaultLanguage): Promise<void> {
  if (!initialized) {
    await loadLocaleMessages(lang);
    return;
  }
  await locale.set(lang);
  await waitLocaleStore(lang);
}

export async function prepareLocaleForLoad(lang: Locale = defaultLanguage): Promise<void> {
  await loadLocaleMessages(lang);
  if (!browser) {
    await activateLocale(lang);
  }
}

export { _, locale, waitLocale } from 'svelte-i18n';
