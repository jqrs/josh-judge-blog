export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/style.css');
  eleventyConfig.addPassthroughCopy('src/_headers');
  eleventyConfig.addFilter('dateLabel', date => new Intl.DateTimeFormat('en-US', {year:'numeric', month:'long', day:'numeric', timeZone:'UTC'}).format(new Date(date)));
  eleventyConfig.addFilter('isoDate', date => new Date(date).toISOString().slice(0,10));
  eleventyConfig.addFilter('year', () => new Date().getUTCFullYear());
  eleventyConfig.addCollection('posts', api => api.getFilteredByTag('post').filter(p => !p.data.draft).sort((a,b) => b.date - a.date));
  return {dir: {input:'src', output:'dist', includes:'_includes'}, markdownTemplateEngine:'njk', htmlTemplateEngine:'njk'};
}
