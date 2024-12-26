import {
  normalizeTags,
  parseBlogFilename,
  parseOrderPrefix,
  ProductCardFrontmatterSchema,
  BlogPostFrontmatterSchema,
  type BlogPost,
  type BlogPostMeta,
  type ProductCard,
  type ProductPage
} from '$lib/shared/markdown';
import { blogConfig, homeConfig, type Locale } from '$lib/shared/defaults';
import type { HeroData, Strength, CaseStudy } from '$lib/shared/markdown/types';
import { loadMarkdownFile, listMarkdownFiles } from './loader';
import { loadHero, loadStrengths, loadCaseStudies, loadTechnologies } from './pages';

export type HomePageData = {
  hero: HeroData;
  strengths: Strength[];
  independentByDesign: {
    body: string;
    html: string;
  };
  featuredWork: CaseStudy[];
  products: ProductCard[];
  blogPreview: BlogPostMeta[];
  contact: {
    company: string;
    email: string;
    street: string;
    zipCode: string;
    city: string;
    country: string;
    regNumber: string;
    vatNumber: string;
    iban: string;
  };
};

export async function loadHomePage(lang: Locale): Promise<HomePageData> {
  const hero = await loadHero(lang);
  const strengths = await loadStrengths(lang);
  const independentByDesign = await loadMarkdownFile(lang, 'home', 'independent-by-design.md');
  const contactFile = await loadMarkdownFile(lang, 'home', 'contact.md');

  const allWork = await loadCaseStudies(lang);
  const featuredWork = allWork.filter((w) => w.featured).slice(0, homeConfig.maxFeaturedWork);

  const products = await loadProductCards(lang);
  const allPosts = await loadBlogPosts(lang);
  const blogPreview = allPosts
    .slice(0, homeConfig.maxBlogPosts)
    .map(({ body: _b, html: _h, comments: _c, youtube: _y, ...meta }) => meta);

  const contactMeta = contactFile.meta as Record<string, string>;

  return {
    hero,
    strengths,
    independentByDesign: {
      body: independentByDesign.body,
      html: independentByDesign.html
    },
    featuredWork,
    products,
    blogPreview,
    contact: {
      company: contactMeta.company ?? 'Löwenware s.r.o.',
      email: contactMeta.email ?? '',
      street: contactMeta.street ?? '',
      zipCode: contactMeta.zipCode ?? '',
      city: contactMeta.city ?? '',
      country: contactMeta.country ?? '',
      regNumber: contactMeta.regNumber ?? '',
      vatNumber: contactMeta.vatNumber ?? '',
      iban: contactMeta.iban ?? ''
    }
  };
}

export async function loadProductCards(lang: Locale): Promise<ProductCard[]> {
  const files = await listMarkdownFiles(lang, ['products']);
  const cards = await Promise.all(
    files.map(async (file) => {
      const { order, name } = parseOrderPrefix(file.replace('.md', ''));
      const slug = name;
      const loaded = await loadMarkdownFile(lang, 'products', file);
      const meta = ProductCardFrontmatterSchema.parse(loaded.meta);
      return {
        slug,
        name: meta.title,
        summary: meta.summary,
        order: meta.order ?? order,
        pagePath: `/${lang}/${slug}/`,
        externalHref: meta.externalHref,
        image: meta.image,
        isPlaceholder: meta.isPlaceholder ?? false,
        badge: meta.badge
      } satisfies ProductCard;
    })
  );
  return cards.sort((a, b) => a.order - b.order);
}

export async function loadProductPage(lang: Locale, slug: string): Promise<ProductPage | null> {
  const cards = await loadProductCards(lang);
  const card = cards.find((p) => p.slug === slug);
  if (!card) return null;

  const intro = await loadMarkdownFile(lang, 'products', slug, 'index.md').catch(() =>
    loadMarkdownFile(lang, 'products', `${String(card.order).padStart(2, '0')}_${slug}.md`)
  );

  let highlights: ProductPage['highlights'];
  let faq: string | undefined;
  let faqHtml: string | undefined;

  try {
    const highlightFiles = await listMarkdownFiles(lang, ['products', slug, 'highlights']);
    if (highlightFiles.length > 0) {
      highlights = await Promise.all(
        highlightFiles.map(async (file) => {
          const loaded = await loadMarkdownFile(lang, 'products', slug, 'highlights', file);
          const meta = loaded.meta as { title: string; image?: string };
          return {
            title: meta.title,
            body: loaded.body,
            html: loaded.html,
            image: meta.image
          };
        })
      );
    }
  } catch {
    /* no highlights */
  }

  try {
    const faqFile = await loadMarkdownFile(lang, 'products', slug, 'faq.md');
    faq = faqFile.body;
    faqHtml = faqFile.html;
  } catch {
    /* no faq */
  }

  const introMeta = intro.meta as { status?: string; image?: string };

  return {
    ...card,
    image: introMeta.image ?? card.image,
    body: intro.body,
    html: intro.html,
    highlights,
    faq,
    faqHtml,
    status: introMeta.status
  };
}

export async function loadBlogPosts(lang: Locale): Promise<BlogPost[]> {
  const files = await listMarkdownFiles(lang, ['blog']);
  const posts = await Promise.all(
    files.map(async (file) => {
      const parsed = parseBlogFilename(file);
      if (!parsed) return null;
      const loaded = await loadMarkdownFile(lang, 'blog', file);
      const meta = BlogPostFrontmatterSchema.parse(loaded.meta);
      return {
        slug: parsed.slug,
        title: meta.title,
        summary: meta.summary,
        date: meta.date,
        author: meta.author,
        tags: normalizeTags(meta.tags),
        image: meta.image,
        preview: meta.preview,
        body: loaded.body,
        html: loaded.html,
        comments: meta.comments ?? true,
        youtube: meta.youtube
      } satisfies BlogPost;
    })
  );

  return (posts.filter((p) => p !== null) as BlogPost[]).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}

export async function loadBlogPost(lang: Locale, slug: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts(lang);
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function loadBlogPostsByTag(lang: Locale, tag: string): Promise<BlogPost[]> {
  const normalized = tag.toLowerCase();
  const posts = await loadBlogPosts(lang);
  return posts.filter((p) => p.tags.includes(normalized));
}

export function paginatePosts<T>(posts: T[], page: number, perPage = blogConfig.postsPerPage) {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  return {
    items: posts.slice(start, start + perPage),
    currentPage,
    totalPages,
    totalItems: posts.length
  };
}

export async function loadCommunityLinks(lang: Locale) {
  const files = await listMarkdownFiles(lang, ['community']);
  const links = await Promise.all(
    files.map(async (file) => {
      const loaded = await loadMarkdownFile(lang, 'community', file);
      const meta = loaded.meta as {
        title: string;
        label: string;
        url: string;
        action: string;
        order?: number;
        enabled?: boolean;
      };
      const { order } = parseOrderPrefix(file.replace('.md', ''));
      return {
        title: meta.title,
        label: meta.label,
        url: meta.url,
        action: meta.action,
        order: meta.order ?? order,
        enabled: meta.enabled ?? true
      };
    })
  );
  return links.filter((link) => !!link.enabled).sort((a, b) => a.order - b.order);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await loadBlogPosts('en');
  return posts.map((p) => p.slug);
}

export async function getAllTags(lang: Locale): Promise<string[]> {
  const posts = await loadBlogPosts(lang);
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) tags.add(tag);
  }
  return [...tags].sort();
}

export {
  loadHero,
  loadStrengths,
  loadTechnologies,
  loadServices,
  loadCaseStudies,
  loadCaseStudy,
  loadAboutPage,
  loadPrivacyPage
} from './pages';
