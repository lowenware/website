/// <reference types="@sveltejs/kit" />

declare global {
  namespace App {
    interface Locals {
      lang: import('$lib/shared/defaults').Locale;
    }
  }
}

export {};
