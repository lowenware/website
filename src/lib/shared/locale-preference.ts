import { browser } from '$app/environment';
import { defaultLanguage, isValidLocale, type Locale } from '$lib/shared/defaults';

export const STORAGE_KEY = 'preferred-locale';

export function savePreferredLocale(lang: Locale): void {
  if (!browser) return;
  localStorage.setItem(STORAGE_KEY, lang);
}

export function resolvePreferredLocale(): Locale {
  if (browser) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidLocale(stored)) return stored;
  }

  if (browser) {
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith('cs') || nav.startsWith('sk')) return 'cs';
  }

  return defaultLanguage;
}
