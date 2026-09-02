import {
  CaseStudyFrontmatterSchema,
  HeroFrontmatterSchema,
  ServiceFrontmatterSchema,
  StrengthFrontmatterSchema,
  TechnologyFrontmatterSchema,
  parseOrderPrefix
} from '$lib/shared/markdown';
import type {
  CaseStudy,
  HeroData,
  Service,
  Strength,
  Technology
} from '$lib/shared/markdown/types';
import type { Locale } from '$lib/shared/defaults';
import { loadMarkdownFile, listMarkdownFiles } from './loader';

export async function loadHero(lang: Locale): Promise<HeroData> {
  const loaded = await loadMarkdownFile(lang, 'home', 'hero.md');
  const meta = HeroFrontmatterSchema.parse(loaded.meta);
  return {
    title: meta.title,
    subtitle: meta.subtitle,
    image: meta.image,
    body: loaded.body,
    html: loaded.html,
    primaryCta: meta.primaryCta,
    primaryCtaHref: meta.primaryCtaHref,
    secondaryCta: meta.secondaryCta,
    secondaryCtaHref: meta.secondaryCtaHref
  };
}

export async function loadStrengths(lang: Locale): Promise<Strength[]> {
  const files = await listMarkdownFiles(lang, ['home', 'strengths']);
  const items = await Promise.all(
    files.map(async (file) => {
      const loaded = await loadMarkdownFile(lang, 'home', 'strengths', file);
      const meta = StrengthFrontmatterSchema.parse(loaded.meta);
      const { order, name } = parseOrderPrefix(file.replace('.md', ''));
      return {
        slug: name,
        title: meta.title,
        summary: meta.summary,
        body: loaded.body,
        html: loaded.html,
        order: meta.order ?? order,
        icon: meta.icon
      } satisfies Strength;
    })
  );
  return items.sort((a, b) => a.order - b.order);
}

export async function loadTechnologies(lang: Locale): Promise<Technology[]> {
  const files = await listMarkdownFiles(lang, ['home', 'technologies']);
  const items = await Promise.all(
    files.map(async (file) => {
      const loaded = await loadMarkdownFile(lang, 'home', 'technologies', file);
      const meta = TechnologyFrontmatterSchema.parse(loaded.meta);
      const { order, name } = parseOrderPrefix(file.replace('.md', ''));
      return {
        slug: name,
        title: meta.title,
        label: meta.label,
        url: meta.url,
        order: meta.order ?? order,
        icon: meta.icon,
        width: meta.width,
        height: meta.height
      } satisfies Technology;
    })
  );
  return items.sort((a, b) => a.order - b.order);
}

export async function loadServices(lang: Locale): Promise<Service[]> {
  const files = await listMarkdownFiles(lang, ['services']);
  const items = await Promise.all(
    files.map(async (file) => {
      const loaded = await loadMarkdownFile(lang, 'services', file);
      const meta = ServiceFrontmatterSchema.parse(loaded.meta);
      const { order, name } = parseOrderPrefix(file.replace('.md', ''));
      return {
        slug: name,
        title: meta.title,
        summary: meta.summary,
        body: loaded.body,
        html: loaded.html,
        order: meta.order ?? order
      } satisfies Service;
    })
  );
  return items.sort((a, b) => a.order - b.order);
}

export async function loadCaseStudies(lang: Locale): Promise<CaseStudy[]> {
  const files = await listMarkdownFiles(lang, ['about', 'projects']);
  const items = await Promise.all(
    files.map(async (file) => {
      const loaded = await loadMarkdownFile(lang, 'about', 'projects', file);
      const meta = CaseStudyFrontmatterSchema.parse(loaded.meta);
      const { order, name } = parseOrderPrefix(file.replace('.md', ''));
      return {
        slug: name,
        title: meta.title,
        logo: meta.logo,
        client: meta.client,
        summary: meta.summary,
        body: loaded.body,
        html: loaded.html,
        featured: meta.featured,
        order: meta.order ?? order,
        technologies: meta.technologies ?? []
      } satisfies CaseStudy;
    })
  );
  return items.sort((a, b) => a.order - b.order);
}

export async function loadCaseStudy(lang: Locale, slug: string): Promise<CaseStudy | null> {
  const studies = await loadCaseStudies(lang);
  return studies.find((s) => s.slug === slug) ?? null;
}

export async function loadAboutPage(lang: Locale) {
  const intro = await loadMarkdownFile(lang, 'about', 'intro.md');
  const howWeWork = await loadMarkdownFile(lang, 'about', 'how-we-work.md');
  const mission = await loadMarkdownFile(lang, 'about', 'mission.md').catch(() => null);
  return {
    intro: { body: intro.body, html: intro.html },
    howWeWork: { body: howWeWork.body, html: howWeWork.html },
    mission: mission
      ? {
          title: (mission.meta as { title?: string }).title ?? 'Mission',
          body: mission.body,
          html: mission.html
        }
      : null
  };
}

export async function loadPrivacyPage(lang: Locale) {
  const loaded = await loadMarkdownFile(lang, 'legal', 'privacy.md');
  const meta = loaded.meta as { title?: string };
  return {
    title: meta.title ?? 'Privacy Statement',
    body: loaded.body,
    html: loaded.html
  };
}
