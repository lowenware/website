import { getAllBlogSlugs } from '$lib/server/markdown';
import { origin, publishedLocales } from '$lib/shared/defaults';
import { absoluteUrl } from '$lib/shared/paths';

export const prerender = true;

const staticPages = [
  '/',
  '/services/',
  '/work/',
  '/about/',
  '/contact/',
  '/privacy/',
  '/blog/',
  '/dotrix/',
  '/lowenbooks/',
  '/mythstic/'
];

export async function GET() {
  const slugs = await getAllBlogSlugs();
  const urls: string[] = [];

  for (const lang of publishedLocales) {
    for (const page of staticPages) {
      urls.push(absoluteUrl(`/${lang}${page}`, origin));
    }

    for (const slug of slugs) {
      urls.push(absoluteUrl(`/${lang}/blog/${slug}/`, origin));
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
