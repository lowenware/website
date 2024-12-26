export const BLOG_FILENAME_RE = /^(\d{8})_(.+)\.md$/;

export function parseBlogFilename(filename: string): { datePrefix: string; slug: string } | null {
  const match = filename.match(BLOG_FILENAME_RE);
  if (!match) return null;
  return { datePrefix: match[1], slug: match[2] };
}

export function blogFilenameFromParts(datePrefix: string, slug: string): string {
  return `${datePrefix}_${slug}.md`;
}

export function parseOrderPrefix(filename: string): { order: number; name: string } {
  const match = filename.match(/^(\d+)_(.+)$/);
  if (!match) return { order: 999, name: filename };
  return { order: Number.parseInt(match[1], 10), name: match[2] };
}
