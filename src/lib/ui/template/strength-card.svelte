<script lang="ts">
  import type { Strength } from '$lib/shared/markdown/types';

  type Props = {
    strength: Strength;
    index: number;
  };

  let { strength, index: _index }: Props = $props();
</script>

<div class="strength-card">
  <div class="strength-index" aria-hidden="true"></div>
  <h2 class="strength-title">{strength.title}</h2>
  <p class="strength-summary">{strength.summary}</p>
</div>

<style>
  .strength-card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem;
    border-radius: 0.5rem;
    background: var(--color-surface-lighter);
    overflow: hidden;
  }

  .strength-index {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 0.2rem;
    margin-bottom: 0.75rem;
    border-radius: 0.75rem;
    background: var(--color-grey-600);
  }

  .strength-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 2rem;
  }

  .strength-summary {
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--color-grey-600);
  }
</style>
