<script lang="ts">
  import { _ } from '$lib/i18n';

  type Props = {
    html: string;
  };

  let { html }: Props = $props();
</script>

<section id="independent" class="section" aria-labelledby="independent-heading">
  <div class="container container-narrow">
    <h2 id="independent-heading" class="section-title">{$_('section.independent.title')}</h2>
    <div class="prose prose-invert paragraphs">{@html html}</div>
  </div>
</section>

<style>
  @import './home-section.css';

  .paragraphs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
