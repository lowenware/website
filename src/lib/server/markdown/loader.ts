import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { contentExtension, contentRoot, defaultLanguage, type Locale } from '$lib/shared/defaults';
import type { LoadedMarkdown } from '$lib/shared/markdown';
import { parseMarkdown } from './parser';
import { sanitizeHtml } from './sanitize';

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readFileContent(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

export async function loadMarkdownFile<TMeta extends Record<string, unknown>>(
  lang: Locale,
  ...parts: string[]
): Promise<LoadedMarkdown<TMeta>> {
  const localizedPath = path.join(contentRoot, lang, ...parts);
  let filePath = localizedPath;

  if (lang !== defaultLanguage && !(await exists(localizedPath))) {
    filePath = path.join(contentRoot, defaultLanguage, ...parts);
  }

  const raw = await readFileContent(filePath);
  const { data, content } = matter(raw);
  const html = sanitizeHtml(parseMarkdown(content.trim()));

  return {
    meta: data as TMeta,
    body: content.trim(),
    html
  };
}

export async function listMarkdownFiles(lang: Locale, dirParts: string[]): Promise<string[]> {
  const localizedDir = path.join(contentRoot, lang, ...dirParts);
  let dirPath = localizedDir;

  if (lang !== defaultLanguage && !(await exists(localizedDir))) {
    dirPath = path.join(contentRoot, defaultLanguage, ...dirParts);
  }

  try {
    const entries = await fs.readdir(dirPath);
    return entries.filter((e) => e.endsWith(contentExtension)).sort();
  } catch {
    return [];
  }
}

export async function listMarkdownSubdirs(lang: Locale, dirParts: string[]): Promise<string[]> {
  const localizedDir = path.join(contentRoot, lang, ...dirParts);
  let dirPath = localizedDir;

  if (lang !== defaultLanguage && !(await exists(localizedDir))) {
    dirPath = path.join(contentRoot, defaultLanguage, ...dirParts);
  }

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}
