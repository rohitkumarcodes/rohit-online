module.exports = {
  eleventyComputed: {
    layout: (data) => (data.is_page ? "layouts/page.njk" : "layouts/post.njk"),
    permalink: (data) => (data.publish === false ? false : `/${data.slug}/index.html`),
    date: (data) => (data.published_date ? new Date(data.published_date) : undefined),
    tags: (data) => (data.is_page ? ["pages"] : ["posts"]),
    lang: (data) => data.lang || "en",
    eleventyExcludeFromCollections: (data) => data.publish === false,
  },
};
