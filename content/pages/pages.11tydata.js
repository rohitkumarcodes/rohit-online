module.exports = {
  layout: "layouts/page.njk",
  tags: ["pages"],
  bodyClass: "template-page",
  permalink: (data) => `/${data.page.fileSlug}/index.html`,
};
