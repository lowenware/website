<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import { _ } from '$lib/i18n';

  type ContactInfo = {
    street: string;
    zipCode: string;
    city: string;
    country: string;
    regNumber: string;
    vatNumber: string;
  };

  type Props = {
    lang: Locale;
    contact: ContactInfo;
    community: Array<{ title: string; label: string; url: string; action: string }>;
  };

  let { lang, contact, community }: Props = $props();
  const year = new Date().getFullYear();

  const formattedZip = $derived(
    contact.zipCode.length === 5
      ? `${contact.zipCode.slice(0, 3)} ${contact.zipCode.slice(3)}`
      : contact.zipCode
  );

  const iconMap: Record<string, string> = {
    GitHub: 'logo-github.svg',
    Twitter: 'logo-twitter.svg',
    YouTube: 'logo-youtube.svg',
    LinkedIn: 'logo-linkedin.svg',
    Discord: 'logo-discord.svg'
  };

  const navLinks = $derived([
    { href: `/${lang}/services/`, label: 'nav.services' },
    { href: `/${lang}/about/`, label: 'nav.about' },
    { href: `/${lang}/blog/`, label: 'nav.insights' },
    { href: `/${lang}/contact/`, label: 'nav.contact' },
    { href: `/${lang}/privacy/`, label: 'nav.privacy' },
  ] as const);

  const productLinks = $derived([
    { href: `/${lang}/lowenbooks/`, label: 'Löwenbooks' },
    { href: `/${lang}/dotrix/`, label: 'Dotrix' },
    { href: `/${lang}/mythstic/`, label: 'Mythstic' }
  ] as const);
</script>

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <p class="footer-name">{$_('site.name')}</p>
      <p class="footer-tagline">{$_('footer.tagline')}</p>
      <p class="footer-label">{$_('contact.address')}</p>
      <address class="footer-address">
        {contact.street}<br />
        {formattedZip} {contact.city}<br />
        {contact.country}
      </address>
      <dl class="footer-company-ids">
        <div>
          <dt>{$_('contact.companyId')}</dt>
          <dd>{contact.regNumber}</dd>
        </div>
        <div>
          <dt>{$_('contact.companyVatId')}</dt>
          <dd>{contact.vatNumber}</dd>
        </div>
      </dl>
    </div>

    <div class="footer-col">
      <p class="footer-col-title">{$_('footer.navigation')}</p>
      <ul class="footer-links">
        {#each navLinks as link (link.href)}
          <li><a href={link.href}>{$_(link.label)}</a></li>
        {/each}
      </ul>
    </div>

    <div class="footer-col">
      <p class="footer-col-title">{$_('nav.products')}</p>
      <ul class="footer-links">
        {#each productLinks as link (link.href)}
          <li><a href={link.href}>{link.label}</a></li>
        {/each}
      </ul>
    </div>

    <div class="footer-col">
      <p class="footer-col-title">{$_('footer.community')}</p>
      <div class="social-links">
        {#each community as link (link.url)}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon"
            aria-label={link.label}
          >
            {#if iconMap[link.label]}
              <img src="/icons/{iconMap[link.label]}" alt="" class="social-img" />
            {:else}
              <span>{link.label}</span>
            {/if}
          </a>
        {/each}
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <p>© 2017 – {year} Löwenware s.r.o.</p>
  </div>
</footer>

<style>
  .site-footer {
    background: var(--color-dark);
    color: var(--color-grey-600);
    font-size: 0.875rem;
  }

  .footer-inner {
    display: grid;
    gap: 2rem;
    max-width: var(--container-8xl);
    margin: 0 auto;
    padding: 3rem max(1rem, env(safe-area-inset-right)) 2rem max(1rem, env(safe-area-inset-left));
  }

  @media (min-width: 768px) {
    .footer-inner {
      grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 3rem 2rem 2rem;
    }
  }

  .footer-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.25rem;
  }

  .footer-tagline {
    margin-bottom: 0.75rem;
  }

  .footer-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #fff;
    margin-bottom: 0.25rem;
  }

  .footer-address {
    font-style: normal;
    line-height: 1.5;
    margin-bottom: 0.75rem;
  }

  .footer-company-ids {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin: 0;
  }

  .footer-company-ids dt {
    display: inline;
    color: #fff;
  }

  .footer-company-ids dt::after {
    content: ': ';
  }

  .footer-company-ids dd {
    display: inline;
    margin: 0;
    color: var(--color-grey-600);
  }

  .footer-col-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  .footer-links {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-links a {
    color: var(--color-grey-600);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-links a:hover,
  .footer-links a:focus-visible {
    color: var(--color-blue-brand);
  }

  .social-links {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .social-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.75rem;
    min-height: 2.75rem;
    color: #fff;
    transition: color 0.2s;
  }

  .social-icon:hover,
  .social-icon:focus-visible {
    color: var(--color-blue-brand);
  }

  .social-img {
    width: 1.25rem;
    height: 1.25rem;
    filter: brightness(0) invert(1);
    transition: filter 0.2s;
  }

  .social-icon:hover .social-img,
  .social-icon:focus-visible .social-img {
    filter: brightness(0) saturate(100%) invert(56%) sepia(93%) saturate(1352%) hue-rotate(166deg)
      brightness(101%) contrast(101%);
  }

  .footer-bottom {
    border-top: 1px solid var(--color-surface-border);
    max-width: var(--container-8xl);
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
    font-size: 0.8125rem;
  }

  @media (min-width: 768px) {
    .footer-bottom {
      padding: 1rem 2rem;
      text-align: left;
    }
  }
</style>
