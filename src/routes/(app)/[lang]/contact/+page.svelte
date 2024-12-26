<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import InquiryForm from '$lib/ui/template/inquiry-form.svelte';
  import { _ } from '$lib/i18n';
  import { buildAlternates } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';

  let { data } = $props();
  const { lang, inquiryApiUrl } = $derived(data);
  const canonical = $derived(absoluteUrl(`/${lang}/contact/`, origin));
  const alternates = $derived(buildAlternates('/contact/'));
</script>

<SeoHead
  title={$_('inquiry.title')}
  description={$_('seo.inquiry.description')}
  {canonical}
  {alternates}
/>

<main class="page">
  <div class="container">
    <header class="page-header">
      <h1>{$_('inquiry.title')}</h1>
      <p class="page-subtitle">{$_('inquiry.subtitle')}</p>
    </header>

    <InquiryForm {lang} {inquiryApiUrl} />
  </div>
</main>

<style>
  .page {
    padding: 4rem 0;
  }

  .container {
    max-width: var(--container-8xl);
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (min-width: 768px) {
    .container {
      padding: 0 2rem;
    }
  }

  .page-header {
    text-align: center;
    margin-bottom: 2.5rem;
    max-width: 36rem;
  }

  .page-header h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  .page-subtitle {
    color: var(--color-grey-600);
    line-height: 1.6;
  }
</style>
