# Create a Page

Use this flow for evergreen site pages such as About, Contact, Uses, or Resources.

## 1. Decide Whether It Should Be a Page

Choose a page when the content is more like reference material or a permanent section of the site. If the content is time-based writing that should appear in `/posts/` and in the feed, create a post instead.

## 2. Choose the Slug

Create the file in `content/pages/` with a short lowercase kebab-case filename.

- `content/pages/reading.md` becomes `/reading/`
- `content/pages/interviews.md` becomes `/interviews/`

## 3. Create the File

Start from this template:

```md
---
title: Reading
date: 2026-03-26T18:30:00+05:30
---

Page body goes here.
```

Page files inherit their layout, tag, and permalink from `content/pages/pages.11tydata.js`.

## 4. Add the Content

Pages are a little more flexible than posts.

- If the body does not start with a heading, the layout will print the front matter title for you.
- If the body starts with `# Heading`, the layout will use that heading and skip the automatic page title.
- Use Markdown for most content and raw HTML only when it helps.

## 5. Decide Whether It Belongs in Navigation

Pages are not added to the main menu automatically.

- If the page should appear in the top navigation, update `_data/site.js`.
- If it is a secondary page, link to it from another page such as `/more/` instead.

## 6. Preview and Build

Run:

```bash
pnpm dev
pnpm build
```

Pages do not appear in `/posts/` and are not included in the Atom feed unless the site code changes.
