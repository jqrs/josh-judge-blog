export default {
  layout: 'post.njk',
  tags: ['post'],
  eleventyComputed: {
    permalink: data => data.draft ? false : `/articles/${data.page.fileSlug}/`
  }
};
