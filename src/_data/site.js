import { readFileSync } from 'node:fs';
import matter from 'gray-matter';

export default function() {
  const { data } = matter(readFileSync('src/site.md', 'utf8'));
  return {
    ...data,
    url: (process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://josh-judge-blog.pages.dev').replace(/\/$/, '')
  };
}
