/** Single source of truth for legacy URL redirects (targets always EN). */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // Flattened pages
  '/about': '/en/#about',
  '/about/': '/en/#about',
  '/contact': '/en/contact/',
  '/contact/': '/en/contact/',
  '/inquiry': '/en/contact/',
  '/inquiry/': '/en/contact/',
  '/en/inquiry': '/en/contact/',
  '/en/inquiry/': '/en/contact/',
  '/cs/inquiry': '/cs/contact/',
  '/cs/inquiry/': '/cs/contact/',

  // Dotrix preserved
  '/dotrix': '/en/dotrix/',
  '/dotrix/': '/en/dotrix/',
  '/dotrix/donate': '/en/dotrix/',
  '/dotrix/donate/': '/en/dotrix/',
  '/dotrix/handbook': 'https://dotrix.rs/',
  '/dotrix/handbook/': 'https://dotrix.rs/',
  '/dotrix/page/1': '/en/dotrix/',
  '/dotrix/page/1/': '/en/dotrix/',

  // Home aliases
  '/home': '/en/',
  '/home/': '/en/',

  // Blog path restructure
  '/blog/page/1': '/en/blog/',
  '/blog/page/1/': '/en/blog/',
  '/blog/gamedev/gamedev-relaunch': '/en/blog/gamedev-relaunch/',
  '/blog/gamedev/gamedev-relaunch/': '/en/blog/gamedev-relaunch/',
  '/blog/osdev/aarch64-bare-metal-program-in-rust': '/en/blog/aarch64-bare-metal-program-in-rust/',
  '/blog/osdev/aarch64-bare-metal-program-in-rust/': '/en/blog/aarch64-bare-metal-program-in-rust/',
  '/blog/osdev/aarch64-gic-and-timer-interrupt': '/en/blog/aarch64-gic-and-timer-interrupt/',
  '/blog/osdev/aarch64-gic-and-timer-interrupt/': '/en/blog/aarch64-gic-and-timer-interrupt/',
  '/blog/osdev/aarch64-mmu-programming': '/en/blog/aarch64-mmu-programming/',
  '/blog/osdev/aarch64-mmu-programming/': '/en/blog/aarch64-mmu-programming/',
  '/blog/osdev/joining-100-days-of-code': '/en/blog/',
  '/blog/osdev/joining-100-days-of-code/': '/en/blog/',
  '/blog/tutorials/get-started-with-aisl': '/en/blog/get-started-with-aisl/',
  '/blog/tutorials/get-started-with-aisl/': '/en/blog/get-started-with-aisl/',

  // Tag pages → blog tags
  '/tags': '/en/blog/',
  '/tags/': '/en/blog/',
  '/tags/100daysofcode': '/en/blog/tags/100daysofcode/',
  '/tags/100daysofcode/': '/en/blog/tags/100daysofcode/',
  '/tags/aarch64': '/en/blog/tags/aarch64/',
  '/tags/aarch64/': '/en/blog/tags/aarch64/',
  '/tags/aisl': '/en/blog/tags/aisl/',
  '/tags/aisl/': '/en/blog/tags/aisl/',
  '/tags/assembler': '/en/blog/tags/assembler/',
  '/tags/assembler/': '/en/blog/tags/assembler/',
  '/tags/backend': '/en/blog/tags/backend/',
  '/tags/backend/': '/en/blog/tags/backend/',
  '/tags/disassembly': '/en/blog/tags/disassembly/',
  '/tags/disassembly/': '/en/blog/tags/disassembly/',
  '/tags/dotrix': '/en/blog/tags/dotrix/',
  '/tags/dotrix/': '/en/blog/tags/dotrix/',
  '/tags/leos': '/en/blog/tags/leos/',
  '/tags/leos/': '/en/blog/tags/leos/',
  '/tags/minion': '/en/blog/tags/minion/',
  '/tags/minion/': '/en/blog/tags/minion/',
  '/tags/rust': '/en/blog/tags/rust/',
  '/tags/rust/': '/en/blog/tags/rust/',
  '/tags/webdev': '/en/blog/tags/webdev/',
  '/tags/webdev/': '/en/blog/tags/webdev/',

  // Category pages
  '/categories': '/en/blog/',
  '/categories/': '/en/blog/',
  '/categories/gamedev': '/en/blog/tags/gamedev/',
  '/categories/gamedev/': '/en/blog/tags/gamedev/',
  '/categories/news': '/en/blog/',
  '/categories/news/': '/en/blog/',
  '/categories/osdev': '/en/blog/',
  '/categories/osdev/': '/en/blog/',
  '/categories/tutorial': '/en/blog/',
  '/categories/tutorial/': '/en/blog/',

  // Removed sections
  '/aisl': '/en/',
  '/aisl/': '/en/',
  '/aisl/handbook/client': '/en/',
  '/aisl/handbook/client/': '/en/',
  '/aisl/handbook/configuration': '/en/',
  '/aisl/handbook/configuration/': '/en/',
  '/aisl/handbook/enumerations': '/en/',
  '/aisl/handbook/enumerations/': '/en/',
  '/aisl/handbook/events-model': '/en/',
  '/aisl/handbook/events-model/': '/en/',
  '/aisl/handbook/instance': '/en/',
  '/aisl/handbook/instance/': '/en/',
  '/aisl/handbook/server': '/en/',
  '/aisl/handbook/server/': '/en/',
  '/aisl/handbook/stream': '/en/',
  '/aisl/handbook/stream/': '/en/',
  '/leos': '/en/',
  '/leos/': '/en/',
  '/leos/contributing': '/en/',
  '/leos/contributing/': '/en/',
  '/leos/how-to-try': '/en/',
  '/leos/how-to-try/': '/en/',
  '/leos/roadmap': '/en/',
  '/leos/roadmap/': '/en/',

  // Legal (old flat URLs)
  '/privacy-statement': '/en/privacy/',
  '/privacy-statement/': '/en/privacy/',
  '/terms-of-use': '/en/',
  '/terms-of-use/': '/en/'
};

export function resolveLegacyRedirect(pathname: string): string | null {
  if (LEGACY_REDIRECTS[pathname]) return LEGACY_REDIRECTS[pathname];
  const withoutTrailing =
    pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  if (LEGACY_REDIRECTS[withoutTrailing]) return LEGACY_REDIRECTS[withoutTrailing];
  const withTrailing = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (LEGACY_REDIRECTS[withTrailing]) return LEGACY_REDIRECTS[withTrailing];
  return null;
}
