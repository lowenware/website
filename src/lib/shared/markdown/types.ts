import type { ProductBadge } from '$lib/shared/product-badge';

export type LoadedMarkdown<TMeta extends Record<string, unknown> = Record<string, unknown>> = {
  meta: TMeta;
  body: string;
  html: string;
};

export type BlogPostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: Date;
  author: string;
  tags: string[];
  image?: string;
  preview?: string;
};

export type BlogPost = BlogPostMeta & {
  body: string;
  html: string;
  comments: boolean;
  youtube?: string;
};

export type ProductCard = {
  slug: string;
  name: string;
  summary: string;
  order: number;
  pagePath: string;
  externalHref?: string;
  image?: string;
  isPlaceholder: boolean;
  badge?: ProductBadge;
};

export type ProductPage = ProductCard & {
  body: string;
  html: string;
  highlights?: Array<{ title: string; body: string; html: string; image?: string }>;
  faq?: string;
  faqHtml?: string;
  status?: string;
};

export type HeroData = {
  title: string;
  subtitle: string;
  image?: string;
  body: string;
  html: string;
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta: string;
  secondaryCtaHref: string;
};

export type Strength = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  html: string;
  order: number;
  icon?: string;
};

export type Technology = {
  slug: string;
  title: string;
  label: string;
  url?: string;
  order: number;
  icon?: string;
  width?: number;
  height?: number;
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  html: string;
  order: number;
};

export type CaseStudy = {
  slug: string;
  title: string;
  logo: string;
  client?: string;
  summary: string;
  body: string;
  html: string;
  featured: boolean;
  order: number;
  technologies: string[];
};

export * from './slug.js';
export * from './frontmatter.js';
