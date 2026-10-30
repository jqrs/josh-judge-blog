import MarkdownIt from 'markdown-it';

export default function(eleventyConfig) {
  const markdown = new MarkdownIt({ html: true });
  markdown.core.ruler.after('inline', 'photo_figures', state => {
    for (let i = 0; i < state.tokens.length - 2; i++) {
      const [open, inline, close] = state.tokens.slice(i, i + 3);
      if (open.type !== 'paragraph_open' || inline.type !== 'inline' || close.type !== 'paragraph_close') continue;
      const children = inline.children.filter(token => token.type !== 'text' || token.content.trim());
      if (children.length === 1 && children[0].type === 'image') {
        open.tag = close.tag = 'figure';
        open.attrSet('class', 'inline-photo');
        children[0].meta = { photoFigure: true };
      }
    }
  });
  markdown.renderer.rules.image = (tokens, index, options, env, renderer) => {
    const token = tokens[index];
    const escape = markdown.utils.escapeHtml;
    const src = escape(token.attrGet('src') || '');
    const alt = escape(renderer.renderInlineAsText(token.children || [], options, env));
    const caption = escape(token.attrGet('title') || '');
    const image = `<a class="photo-link" href="${src}" data-photo data-caption="${caption}" data-alt="${alt}"><img src="${src}" alt="${alt}" loading="lazy" decoding="async"></a>`;
    return image + (caption && token.meta?.photoFigure ? `<figcaption>${caption}</figcaption>` : '');
  };
  eleventyConfig.setLibrary('md', markdown);
  eleventyConfig.addPassthroughCopy('src/photos');
  eleventyConfig.addPassthroughCopy('src/photos.js');
  eleventyConfig.addWatchTarget('src/site.md');
  eleventyConfig.addPassthroughCopy('src/style.css');
  eleventyConfig.addPassthroughCopy('src/_headers');
  eleventyConfig.addFilter('dateLabel', date => new Intl.DateTimeFormat('en-US', {year:'numeric', month:'long', day:'numeric', timeZone:'UTC'}).format(new Date(date)));
  eleventyConfig.addFilter('isoDate', date => new Date(date).toISOString().slice(0,10));
  eleventyConfig.addFilter('year', () => new Date().getUTCFullYear());
  eleventyConfig.addCollection('posts', api => api.getFilteredByTag('post').filter(p => !p.data.draft).sort((a,b) => b.date - a.date));
  return {dir: {input:'src', output:'dist', includes:'_includes'}, markdownTemplateEngine:'njk', htmlTemplateEngine:'njk'};
}
