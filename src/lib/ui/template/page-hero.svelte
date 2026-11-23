<script lang="ts">
  type Props = {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
    headingId?: string;
  };

  let { eyebrow, title, subtitle, image, headingId = 'page-hero-heading' }: Props = $props();

  const imageSrc = $derived(image ? `/${image}` : null);
</script>

<section class="page-hero hero--dark-bg" aria-labelledby={headingId}>
  {#if imageSrc}
    <img src={imageSrc} alt="" class="page-hero-image" fetchpriority="high" />
    <div class="page-hero-overlay" aria-hidden="true"></div>
  {/if}

  <div class="page-hero-content">
    <p class="page-hero-eyebrow">{eyebrow}</p>
    <h1 id={headingId} class="page-hero-title">{title}</h1>
    <p class="page-hero-subtitle">{subtitle}</p>
  </div>
</section>

<style>
  .page-hero {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: min(50vh, 420px);
    overflow: hidden;
    background: var(--color-dark);
  }

  .page-hero-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .page-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10, 11, 13, 0.3) 0%,
      rgba(10, 11, 13, 0.6) 55%,
      rgba(10, 11, 13, 0.3) 100%
    );
  }

  .page-hero-content {
    position: relative;
    z-index: 1;
    max-width: 48rem;
    padding: 3.5rem max(1rem, env(safe-area-inset-right)) 3rem max(1rem, env(safe-area-inset-left));
    text-align: center;
    width: 100%;
  }

  @media (min-width: 768px) {
    .page-hero-content {
      padding: 4.5rem 1.5rem 3.5rem;
    }
  }

  .page-hero-eyebrow {
    margin: 0 0 1rem;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-blue-brand);
  }

  .page-hero-title {
    margin: 0 0 1.25rem;
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    font-weight: 700;
    line-height: 1.15;
    color: #fff;
  }

  .page-hero-subtitle {
    margin: 0 auto;
    max-width: 40rem;
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    line-height: 1.6;
    color: var(--color-grey-200);
  }
</style>
