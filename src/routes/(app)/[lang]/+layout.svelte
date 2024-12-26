<script lang="ts">
  import { locale } from '$lib/i18n';
  import SiteHeader from '$lib/ui/layout/site-header.svelte';
  import SiteFooter from '$lib/ui/layout/site-footer.svelte';

  let { data, children } = $props();

  $effect.pre(() => {
    locale.set(data.lang);
  });
</script>

<div class="app-shell">
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <SiteHeader lang={data.lang} />
  <div id="main-content" class="app-main">{@render children()}</div>
  <SiteFooter community={data.community} lang={data.lang} contact={data.contact} />
</div>
