# Add Images and Embedded Video

This site allows normal Markdown plus small raw HTML snippets, which keeps media handling simple.

## Images

Store site-hosted images under `assets/images/`. If you want a clean habit for new content, use a folder like `assets/images/posts/<slug>/`.

Use Markdown for simple images:

```md
![Alt text](/assets/images/example.webp)
```

Use HTML when you need width, a caption, or other attributes:

```html
<img src="/assets/images/example.webp" alt="Alt text" width="500">
```

If you want a visible caption, wrap the image in `figure` and use `figcaption`:

```html
<figure>
  <img src="/assets/images/example.webp" alt="Alt text" width="500">
  <figcaption>A short caption</figcaption>
</figure>
```

The build automatically adds intrinsic dimensions for local images on normal pages. The Atom feed also applies a balanced preview cap, so you do not need to pre-scale source images just for feed readers.

## Homepage photos

The homepage picks one photo at random from `assets/images/home/` on each visit. On Netlify, an edge function does that pick so the chosen image is already in the HTML. `pnpm dev` shows the first photo; `netlify dev` or a deploy shows the random rotation.

- Drop `.jpg`, `.jpeg`, `.png`, `.webp`, or `.gif` files in `assets/images/home/`.
- Use short lowercase kebab-case filenames, such as `plumeria-in-hand.jpg`.
- Run `pnpm optimize:home` after adding or replacing photos. That command writes compressed WebP files at 640px and 1280px wide and removes the camera-sized originals.
- Remove a photo's WebP files from that folder to take it out of the rotation.

## External Images

External image URLs work, but site-hosted images are safer for anything important because you control the file and the link.

## Video

Plain Markdown does not have a standard built-in video syntax for this site. The practical approach is to put HTML inside your Markdown file.

For video, choose the lightest option that works:

- Link to the video if an embed is not important.
- Use a self-hosted file with the HTML `video` tag if you want to keep the file in this repo.
- Use a raw `iframe` embed when inline playback matters.

If you want to keep the video in the repo, store it under `assets/videos/`. A clean convention is `assets/videos/posts/<slug>/`.

Page styles already keep self-hosted videos intentionally compact on the site. If you want a rich preview in the Atom feed, add a `poster` attribute that points to an image under `assets/images/`. A clean convention is `assets/images/posts/<slug>/`.

If you want a visible caption under the video, wrap it in `figure` and use `figcaption`. In the feed:

- videos with a `poster` become linked poster previews
- videos without a `poster` fall back to a link to the post
- `iframe` embeds also fall back to a link to the post

Example:

```html
<figure>
  <video
    controls
    preload="metadata"
    poster="/assets/images/posts/my-post/walk-poster.jpg">
    <source src="/assets/videos/posts/my-post/walk.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>A short caption</figcaption>
</figure>
```

For hosted platforms such as YouTube, use an `iframe` embed:

```html
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video title"
  width="560"
  height="315"
  loading="lazy"
  allowfullscreen>
</iframe>
```

No extra JavaScript or Eleventy configuration is required for normal embeds.
