import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import { browser } from '$app/environment';
import { defaultLanguage, supportedLanguages } from '$lib/shared/defaults';

const loaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import('../../lang/en.json'),
  cs: () => import('../../lang/cs.json')
};

for (const lang of supportedLanguages) {
  register(lang, loaders[lang]);
}

export function setupI18n(lang: string = defaultLanguage) {
  init({
    fallbackLocale: defaultLanguage,
    initialLocale: browser ? (getLocaleFromNavigator() ?? lang) : lang
  });
}

export { _, locale, waitLocale } from 'svelte-i18n';
