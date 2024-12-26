<script lang="ts">
  type Props = {
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    type?: 'button' | 'submit';
    disabled?: boolean;
    class?: string;
    children?: import('svelte').Snippet;
  };

  let {
    href,
    variant = 'primary',
    type = 'button',
    disabled = false,
    class: className = '',
    children
  }: Props = $props();
</script>

{#if href}
  <a {href} class="btn btn-{variant} {className}">
    {@render children?.()}
  </a>
{:else}
  <button {type} {disabled} class="btn btn-{variant} {className}">
    {@render children?.()}
  </button>
{/if}
