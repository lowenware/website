<script lang="ts">
  import { page } from '$app/stores';
  import { supportedLanguages, type Locale } from '$lib/shared/defaults';
  import { switchLocalePath } from '$lib/shared/paths';

  type Props = { lang: Locale };
  let { lang }: Props = $props();
</script>

<nav aria-label="Language" class="lang-toggle">
  {#each supportedLanguages as code (code)}
    {@const href = switchLocalePath($page.url.pathname, code)}
    {#if code === lang}
      <span class="lang-current" aria-current="true">{code.toUpperCase()}</span>
    {:else}
      <a class="lang-link" {href}>{code.toUpperCase()}</a>
    {/if}
    {#if code !== supportedLanguages[supportedLanguages.length - 1]}
      <span class="lang-separator" aria-hidden="true">|</span>
    {/if}
  {/each}
</nav>

<style>
  .lang-toggle {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    text-transform: uppercase;
  }

  .lang-current {
    font-weight: 700;
    color: var(--color-blue-brand);
  }

  .lang-link {
    color: var(--color-grey-600);
    text-decoration: none;
  }

  .lang-link:hover {
    color: var(--color-blue-brand);
  }

  .lang-separator {
    color: var(--color-grey-600);
  }
</style>
