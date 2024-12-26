const PRODUCT_IMAGE_PREFIX: Record<string, string> = {
  dotrix: '/dotrix',
  lowenbooks: '/lowenbooks',
  mythstic: '/mythstic'
};

export function getProductImageSrc(slug: string, image: string): string {
  const prefix = PRODUCT_IMAGE_PREFIX[slug] ?? '/products';
  return `${prefix}/${image}`;
}
