import { readFileSync } from 'node:fs';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt();

export default function() {
  const { data, content } = matter(readFileSync('src/site.md', 'utf8'));
  return {
    ...data,
    footer_html: markdown.render(content),
    url: (data.url || process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://josh-judge-blog.pages.dev').replace(/\/$/, '')
  };
}
