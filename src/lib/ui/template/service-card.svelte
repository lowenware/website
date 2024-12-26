<script lang="ts">
  import type { Service } from '$lib/shared/markdown/types';

  type Props = {
    service: Service;
  };

  let { service }: Props = $props();
</script>

<article class="service-card">
  <h2 class="service-title">{service.title}</h2>
  <p class="service-summary">{service.summary}</p>
  <div class="prose service-body">{@html service.html}</div>
</article>

<style>
  .service-card {
    height: 100%;
    padding: 2rem;
    border-radius: 0.5rem;
    background: var(--color-surface);
  }

  .service-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  .service-summary {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-blue-brand);
    margin-bottom: 1.25rem;
  }

  .service-body {
    color: var(--color-grey-600);
    font-size: 0.9375rem;
  }
</style>
