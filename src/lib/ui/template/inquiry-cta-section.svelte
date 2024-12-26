<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';

  type Props = {
    lang: Locale;
  };

  let { lang }: Props = $props();
</script>

<section id="inquiry" class="section section-cta-block" aria-labelledby="inquiry-heading">
  <div class="container container-narrow text-center">
    <h2 id="inquiry-heading" class="section-title">{$_('section.inquiry.title')}</h2>
    <p class="section-subtitle">{$_('section.inquiry.subtitle')}</p>
    <Button href="/{lang}/contact/" variant="primary">{$_('nav.inquiry')}</Button>
  </div>
</section>

<style>
  @import './home-section.css';
</style>
