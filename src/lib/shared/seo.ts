import { origin, publishedLocales, type Locale } from '$lib/shared/defaults';
import { absoluteUrl } from '$lib/shared/paths';

export function buildAlternates(pathWithoutLang: string) {
  const normalized = pathWithoutLang.startsWith('/') ? pathWithoutLang : `/${pathWithoutLang}`;
  return publishedLocales.map((lang) => ({
    lang,
    href: absoluteUrl(`/${lang}${normalized}`, origin)
  }));
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Löwenware',
    url: absoluteUrl('/en/', origin),
    logo: absoluteUrl('/logo.svg', origin)
  };
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Löwenware',
    url: absoluteUrl('/en/', origin)
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  summary: string;
  date: Date;
  author: string;
  slug: string;
  lang: Locale;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date.toISOString(),
    author: { '@type': 'Person', name: post.author },
    url: absoluteUrl(`/${post.lang}/blog/${post.slug}/`, origin),
    image: post.image ? absoluteUrl(`/blog/${post.image}`, origin) : undefined
  };
}

export function softwareApplicationJsonLd(product: {
  name: string;
  description: string;
  lang: Locale;
  slug: string;
  externalHref?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.description,
    url: absoluteUrl(`/${product.lang}/${product.slug}/`, origin),
    sameAs: product.externalHref
  };
}
