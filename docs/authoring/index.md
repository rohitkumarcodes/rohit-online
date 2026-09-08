# Authoring Handbook

This handbook is the internal source of truth for adding and editing content on this Eleventy site. It is for people working in the repo, not for site visitors.

## Site Model

- Blog posts live in `content/posts/`.
- Pages live in `content/pages/`.
- Shared navigation and the public site URL (`https://rohit.onl`) live in `_data/site.js`.
- The blog index lives at `content/pages/posts.njk`.
- The feed lives at `feed.njk`.
- Images and other passthrough assets live under `assets/`.
- Homepage rotation photos live in `assets/images/home/`.

## Start Here

- [Create a blog post](./create-post.md)
- [Create a page](./create-page.md)
- [Add images and embedded video](./media.md)
- [Add or edit navigation](./navigation.md)
- [FAQ](./faq.md)

## Quick Rules

- Filenames become URLs. Use short lowercase kebab-case names.
- Use ISO 8601 timestamps with a timezone offset in front matter.
- Internal links should be root-relative, such as `/posts/`.
- Run `pnpm build` before shipping content changes.
- If you change authoring behavior, update the matching handbook docs in the same change.

## When This Handbook Must Be Updated

Review the handbook whenever changes touch:

- `_data/site.js`
- `content/posts/posts.11tydata.js`
- `content/pages/pages.11tydata.js`
- `_includes/layouts/post.njk`
- `_includes/layouts/page.njk`
- `content/pages/posts.njk`
- `feed.njk`
- `eleventy.config.cjs`
- `package.json` when authoring/build commands change

## Reusable Snippets

- [Post template](./snippets/post-template.md)
- [Page template](./snippets/page-template.md)
- [Media examples](./snippets/media-examples.md)
