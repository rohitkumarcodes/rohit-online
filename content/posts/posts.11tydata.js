module.exports = {
  layout: "layouts/post.njk",
  tags: ["posts"],
  bodyClass: "template-post",
  permalink: (data) => `/${data.page.fileSlug}/index.html`,
};
