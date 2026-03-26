# Create a Blog Post

Use this flow when you want a new entry to appear at `/posts/` and in the Atom feed.

## 1. Choose the Slug

Create the file in `content/posts/` and use a short lowercase kebab-case filename.

- `content/posts/quiet-wins.md` becomes `/quiet-wins/`
- `content/posts/how-i-read.md` becomes `/how-i-read/`

Choose a slug that is stable, readable, and unlikely to need changing later.

## 2. Create the File

Start from this template:

```md
---
title: My New Post
date: 2026-03-26T18:30:00+05:30
---

Opening paragraph.
```

You only need `title` and `date` for the normal flow. Post files inherit their layout, tag, and permalink from `content/posts/posts.11tydata.js`.

## 3. Paste the Post Body

Paste the draft below the front matter and clean up formatting as needed.

- Do not start the body with `# My New Post`. The post layout already prints the title and date.
- Start section headings at `##`.
- Use normal Markdown for paragraphs, lists, blockquotes, and links.
- Raw HTML is allowed if Markdown alone is not enough.

## 4. Add Images or Video

For images and video, follow the fuller guide in [media.md](./media.md). The short version:

- Put site-hosted images somewhere under `assets/images/`.
- Reference them with Markdown like `![Alt text](/assets/images/your-file.webp)` or with raw HTML.
- For video, prefer a plain link when that is enough. If you want an embed, use raw HTML such as an `iframe`.

## 5. Preview the Post

Run:

```bash
pnpm dev
```

Then check:

- the post URL, such as `/quiet-wins/`
- `/posts/` to confirm the post appears in the list

## 6. Build Before Publishing

Run:

```bash
pnpm build
```

The feed and blog index update automatically because posts are collected from the `posts` tag.
