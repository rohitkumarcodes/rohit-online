# Repository Instructions

## Authoring Handbook Contract

- The internal handbook lives under `docs/authoring/`.
- If a change affects publishing flow, feed behavior, navigation, layouts, front matter, content locations, or authoring/build commands, update the handbook in the same task.
- Do not treat handbook updates as follow-up work. If implementation changes authoring behavior, the docs change is part of done.

## Files That Usually Require Handbook Review

- `_data/site.js`
- `content/posts/posts.11tydata.js`
- `content/pages/pages.11tydata.js`
- `_includes/layouts/post.njk`
- `_includes/layouts/page.njk`
- `content/pages/posts.njk`
- `feed.njk`
- `eleventy.config.cjs`
- `netlify.toml` when feed edge behavior changes
- `package.json` when authoring/build commands change

## Matching Guides

- Post flow changes: `docs/authoring/create-post.md` or `docs/authoring/faq.md`
- Page flow changes: `docs/authoring/create-page.md` or `docs/authoring/faq.md`
- Navigation changes: `docs/authoring/navigation.md`
- Feed changes: `docs/authoring/faq.md`
- Shared authoring/build changes: `docs/authoring/index.md`
