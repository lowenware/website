<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import type { Service } from '$lib/shared/markdown/types';
  import { _ } from '$lib/i18n';

  type Props = {
    lang: Locale;
    service: Service;
  };

  let { lang, service }: Props = $props();

  const ctaHref = $derived(
    service.ctaHref.startsWith('/') ? `/${lang}${service.ctaHref}` : service.ctaHref
  );
</script>

<article class="service-card">
  <img src="/{service.image}" alt={service.imageAlt} class="service-image" loading="lazy" />
  <div class="service-body">
    <p class="service-label">{service.label}</p>
    <h2 class="service-title">{service.title}</h2>
    <p class="service-summary">{service.summary}</p>
    <p class="service-audience">
      <span class="service-audience-label"
        ><strong>{$_('section.services.audienceLabel')}</strong></span
      >
      {service.audience}
    </p>
    <div class="prose service-list">{@html service.html}</div>
    <footer class="service-footer">
      <a href={ctaHref} class="service-cta">{service.cta} →</a>
    </footer>
  </div>
</article>

<style>
  .service-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    border-radius: 0.5rem;
    background: var(--color-surface);
  }

  .service-image {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 400 / 220;
    object-fit: cover;
  }

  .service-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1rem;
    padding: 1.75rem;
  }

  .service-label {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-blue-brand);
  }

  .service-audience-label {
    color: #fff;
  }

  .service-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    color: #fff;
  }

  .service-summary {
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-grey-600);
  }

  .service-audience {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--color-grey-600);
  }

  .service-list {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--color-grey-600);
  }

  .service-security {
    margin: 0;
    padding: 0.75rem 0.875rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--color-grey-600);
    border-radius: 0.5rem;
    background: var(--color-surface-lighter);
  }

  .service-footer {
    margin-top: auto;
    padding-top: 1rem;
  }

  .service-package-label {
    margin: 0 0 0.25rem;
    font-size: 0.875rem;
    color: var(--color-grey-600);
  }

  .service-package {
    margin: 0 0 1rem;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;
    color: #fff;
  }

  .service-cta {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-blue-brand);
    text-decoration: none;
  }

  .service-cta:hover {
    text-decoration: underline;
  }
</style>
