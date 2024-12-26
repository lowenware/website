import { z } from 'zod';
import { ProductBadgeSchema } from '$lib/shared/product-badge';

export const LocaleSchema = z.enum(['en', 'cs']);
export type Locale = z.infer<typeof LocaleSchema>;

export const BlogPostFrontmatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: z.coerce.date(),
  author: z.string(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  image: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  preview: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  youtube: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  comments: z.boolean().optional().default(true)
});

export const ProductCardFrontmatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  order: z.coerce.number().optional(),
  externalHref: z.string().url().optional(),
  image: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  isPlaceholder: z.boolean().optional().default(false),
  badge: ProductBadgeSchema.optional()
});

export const HeroSlideFrontmatterSchema = z.object({
  title: z.string(),
  image: z.string(),
  color: z.string(),
  target: z.string().optional(),
  primary: z.string().optional().default('Learn more'),
  secondary: z
    .string()
    .nullish()
    .transform((v) => v ?? null),
  order: z.coerce.number().optional()
});

export const HeroFrontmatterSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  image: z.string().optional().default('slides/hero-1.png'),
  primaryCta: z.string().optional().default('Discuss your project'),
  primaryCtaHref: z.string().optional().default('/contact'),
  secondaryCta: z.string().optional().default('See our work'),
  secondaryCtaHref: z.string().optional().default('/work')
});

export const StrengthFrontmatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  order: z.coerce.number().optional(),
  icon: z.string().optional()
});

export const ServiceFrontmatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  order: z.coerce.number().optional()
});

export const CaseStudyFrontmatterSchema = z.object({
  title: z.string(),
  logo: z.string(),
  client: z.string().optional(),
  summary: z.string(),
  featured: z.boolean().optional().default(false),
  order: z.coerce.number().optional(),
  technologies: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      return v.split(',').map((t) => t.trim());
    })
});

/** @deprecated Use CaseStudyFrontmatterSchema */
export const ProjectFrontmatterSchema = CaseStudyFrontmatterSchema;

export const TechnologyFrontmatterSchema = z.object({
  title: z.string(),
  label: z.string(),
  url: z.string().optional(),
  order: z.coerce.number().optional(),
  icon: z.string().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional()
});

export function normalizeTags(tags: string | string[] | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => t.toLowerCase());
  return tags.split(',').map((t) => t.trim().toLowerCase());
}
