<script lang="ts">
  import SeoHead from '$lib/ui/toolkit/seo-head.svelte';
  import HeroSection from '$lib/ui/template/hero-section.svelte';
  import StrengthsSection from '$lib/ui/template/strengths-section.svelte';
  import FeaturedWorkSection from '$lib/ui/template/featured-work-section.svelte';
  import IndependentSection from '$lib/ui/template/independent-section.svelte';
  import ProductsSection from '$lib/ui/template/products-section.svelte';
  import InsightsSection from '$lib/ui/template/insights-section.svelte';
  import InquiryCtaSection from '$lib/ui/template/inquiry-cta-section.svelte';
  import { _ } from '$lib/i18n';
  import { buildAlternates, organizationJsonLd, webSiteJsonLd } from '$lib/shared/seo';
  import { origin } from '$lib/shared/defaults';
  import { absoluteUrl } from '$lib/shared/paths';

  let { data } = $props();
  const { lang, home } = $derived(data);
  const canonical = $derived(absoluteUrl(`/${lang}/`, origin));
  const alternates = $derived(buildAlternates('/'));
</script>

<SeoHead
  title={$_('site.name')}
  description={$_('seo.home.description')}
  {canonical}
  {alternates}
  jsonLd={[organizationJsonLd(), webSiteJsonLd()]}
/>

<main>
  <HeroSection {lang} hero={home.hero} />
  <StrengthsSection {lang} strengths={home.strengths} />
  <FeaturedWorkSection {lang} featuredWork={home.featuredWork} />
  <IndependentSection html={home.independentByDesign.html} />
  <ProductsSection {lang} products={home.products} />
  <InsightsSection {lang} blogPreview={home.blogPreview} />
  <InquiryCtaSection {lang} />
</main>
