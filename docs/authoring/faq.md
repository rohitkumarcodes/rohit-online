# FAQ

## What is the difference between a post and a page?

Posts are time-based entries in `content/posts/`. They appear in `/posts/` and are included in the Atom feed.

Pages are evergreen documents in `content/pages/`. They do not appear in `/posts/` and are not part of the feed by default.

## Are pages included in the automatically generated feed?

No. The feed template loops over `collections.publishedPosts`, which comes from the `posts` tag.

## Does publishing a post update the feed automatically?

Yes. The feed is rebuilt from `collections.publishedPosts` every time the site is built and deployed.

In practice, that means a newly published post appears in `/feed/` after the next successful deploy.

## If I edit a post after publishing it, what changes in the feed?

The entry content changes because the feed includes the rendered post body.

However, the entry `<updated>` value comes from the post's `date`. If you edit the body but leave the date alone, the content in the feed changes, but some feed readers may not surface it as a newly updated item.

## How do images and video show up in the feed?

Images from local assets are automatically resized to a balanced preview size in the feed while keeping their aspect ratio.

Self-hosted videos are not embedded directly in the feed. If a video has a `poster` attribute, the feed shows a linked poster preview. If it has no `poster`, the feed falls back to a link to the post.

`iframe` embeds also fall back to a link to the post in the feed.

## Do edited old posts move back to the top of the feed?

No. The feed order is based on the post `date`, not on file edit time.

If you want an old post to move higher in the feed, you would need to change its date. Do that only if you really want to republish or re-date it.

## What happens to subscribers if I delete a post?

After the next deploy, the post disappears from the live feed.

Feed readers often keep entries they already fetched in their own local history, so removing a post from the feed does not guarantee it vanishes from every subscriber's reader.

## What if I delete a post and later publish it again?

It depends on the URL.

If you republish it at the same slug, the feed entry keeps the same ID because the entry ID is the post URL. Many feed readers will treat that as the same entry instead of a brand-new one.

If you publish it at a different slug, it gets a new URL and therefore a new feed entry ID. Feed readers are more likely to treat that as a separate item.

## Can I keep a post on the site but leave it out of the feed?

Yes. Keep the normal permalink, but set `eleventyExcludeFromCollections: true` in that post's front matter.

That keeps the page buildable while excluding it from `collections.publishedPosts`, which means it also stays out of `/posts/` and `/feed/`.

## What is the public site URL?

`https://rohit.onl`. It is set as `url` in `_data/site.js` and is used for canonical links and absolute feed URLs. The public contact address is `hello@rohit.onl`.

## How are URLs chosen?

The filename becomes the slug.

- `content/posts/my-post.md` becomes `/my-post/`
- `content/pages/about-writing.md` becomes `/about-writing/`

## Do I need to set tags or permalinks manually?

Not for the normal flow. Directory data files set those defaults for posts and pages.

## Should I add `# Title` inside the Markdown body?

For posts, no. The post layout already prints the title and date from front matter.

For pages, it is optional. If the page body starts with a heading, the page layout will not print a second automatic title.

## Can I use images and video?

Yes. You can use normal Markdown plus small raw HTML snippets. See [media.md](./media.md).

## Does adding a page also add it to the menu?

No. Navigation is manual and lives in `_data/site.js`.
