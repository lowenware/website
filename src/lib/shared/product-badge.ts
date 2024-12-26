import { z } from 'zod';

export const ProductBadgeSchema = z.enum(['concept', 'live', 'opensource']);
export type ProductBadge = z.infer<typeof ProductBadgeSchema>;

const BADGE_CONFIG: Record<ProductBadge, { labelKey: string; className: string }> = {
  concept: { labelKey: 'product.status.concept', className: 'status-badge' },
  live: { labelKey: 'product.status.live', className: 'status-badge status-live' },
  opensource: { labelKey: 'product.status.opensource', className: 'status-badge status-oss' }
};

export function getProductBadge(badge: ProductBadge) {
  return BADGE_CONFIG[badge];
}
