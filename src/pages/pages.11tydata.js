export default {
  layout: 'page.njk',
  tags: ['page'],
  eleventyComputed: {
    permalink: data => data.draft ? false : `/${data.page.fileSlug}/`
  }
};
