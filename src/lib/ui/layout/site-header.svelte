<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import LangToggle from '$lib/ui/toolkit/lang-toggle.svelte';
  import { _ } from '$lib/i18n';

  type Props = {
    lang: Locale;
  };

  let { lang }: Props = $props();

  const navItems = $derived([
    { href: `/${lang}/services/`, label: 'nav.services' },
    { href: `/${lang}/about/`, label: 'nav.about' },
    { href: `/${lang}/blog/`, label: 'nav.insights' },
    { href: `/${lang}/#products`, label: 'nav.products' },
    { href: `/${lang}/contact/`, label: 'nav.contact' }
  ] as const);

  let open = $state(false);

  function close() {
    open = false;
  }

  $effect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (mq.matches) close();
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  });

  $effect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  });
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && close()} />

<header id="header" class="site-header">
  <div class="header-inner">
    <div class="header-side header-side-left">
      <a href="/{lang}/" class="logo-link" aria-label={$_('nav.home')}>
        <img src="/logo.svg" alt="" class="logo-img" width="120" height="40" />
        <span class="logo-text">{$_('site.name')}</span>
      </a>
    </div>

    <nav aria-label="Main" class="desktop-nav">
      {#each navItems as item (item.href)}
        <a href={item.href} class="nav-link">{$_(item.label)}</a>
      {/each}
    </nav>

    <div class="header-side header-side-right">
      <LangToggle {lang} />
      <button
        type="button"
        class="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onclick={() => (open = !open)}
      >
        <span class="sr-only">Menu</span>
        <span class="bar" class:open></span>
        <span class="bar" class:open></span>
        <span class="bar" class:open></span>
      </button>
    </div>
  </div>

  {#if open}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="mobile-nav-backdrop" onclick={close} aria-hidden="true"></div>
    <nav id="mobile-menu" aria-label="Mobile" class="mobile-nav">
      {#each navItems as item (item.href)}
        <a href={item.href} class="mobile-link" onclick={close}>{$_(item.label)}</a>
      {/each}
    </nav>
  {/if}
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--color-dark);
    backdrop-filter: blur(8px);
    opacity: 0.9;
    padding-top: env(safe-area-inset-top, 0px);
  }

  .header-inner {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
    max-width: var(--container-8xl);
    margin: 0 auto;
    padding: 0.875rem max(1rem, env(safe-area-inset-right)) 0.875rem
      max(1rem, env(safe-area-inset-left));
  }

  @media (min-width: 768px) {
    .header-inner {
      padding: 0.4rem 2rem;
    }
  }

  .header-side {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .header-side-left {
    justify-content: flex-start;
  }

  .header-side-right {
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .logo-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #fff;
    text-decoration: none;
  }

  .logo-link:hover {
    color: var(--color-blue-brand);
  }

  .logo-img {
    height: 40px;
    width: auto;
    filter: brightness(0) invert(1);
  }

  @media (min-width: 480px) {
    .logo-img {
      height: 50px;
    }
  }

  .logo-link:hover .logo-img {
    filter: brightness(0) saturate(100%) invert(56%) sepia(93%) saturate(1352%) hue-rotate(166deg)
      brightness(101%) contrast(101%);
  }

  .logo-text {
    font-size: 1.125rem;
    display: none;
  }

  @media (min-width: 768px) {
    .logo-text {
      display: inline;
    }
  }

  .desktop-nav {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    justify-self: center;
  }

  @media (min-width: 768px) {
    .desktop-nav {
      display: flex;
    }
  }

  .nav-link {
    font-size: 0.8125rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-grey-600);
    text-decoration: none;
    transition: color 0.2s;
  }

  .nav-link:hover,
  .nav-link:focus-visible {
    color: var(--color-blue-brand);
  }

  .menu-toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-width: 2.75rem;
    min-height: 2.75rem;
    padding: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
  }

  @media (min-width: 768px) {
    .menu-toggle {
      display: none;
    }
  }

  .bar {
    display: block;
    width: 22px;
    height: 2px;
    background: #fff;
    transition:
      transform 0.2s,
      opacity 0.2s;
  }

  .bar.open:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .bar.open:nth-child(2) {
    opacity: 0;
  }

  .bar.open:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .mobile-nav-backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(10, 11, 13, 0.6);
  }

  .mobile-nav {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 45;
    display: flex;
    flex-direction: column;
    width: min(18rem, 85vw);
    padding: calc(4.5rem + env(safe-area-inset-top, 0px)) 1rem 1.5rem;
    background: var(--color-dark);
    border-left: 1px solid var(--color-surface-border);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  @media (min-width: 768px) {
    .mobile-nav {
      display: none;
    }
  }

  .mobile-link {
    padding: 0.875rem 0;
    min-height: 2.75rem;
    display: flex;
    align-items: center;
    font-size: 0.9375rem;
    color: var(--color-grey-600);
    text-decoration: none;
    border-bottom: 1px solid var(--color-surface-border);
  }

  .mobile-link:hover,
  .mobile-link:focus-visible {
    color: var(--color-blue-brand);
  }

  .mobile-link:last-child {
    border-bottom: none;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
