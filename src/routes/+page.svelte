<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { resolvePreferredLocale } from '$lib/shared/locale-preference';

  onMount(() => {
    goto(`/${resolvePreferredLocale()}/`, { replaceState: true });
  });
</script>
