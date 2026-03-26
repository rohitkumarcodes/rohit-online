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

## External Images

External image URLs work, but site-hosted images are safer for anything important because you control the file and the link.

## Video

Plain Markdown does not have a standard built-in video syntax for this site. The practical approach is to put HTML inside your Markdown file.

For video, choose the lightest option that works:

- Link to the video if an embed is not important.
- Use a self-hosted file with the HTML `video` tag if you want to keep the file in this repo.
- Use a raw `iframe` embed when inline playback matters.

If you want to keep the video in the repo, store it under `assets/videos/`. A clean convention is `assets/videos/posts/<slug>/`.

Use the reusable `post-video` class for self-hosted videos. It keeps the player responsive on small screens and keeps the frame intentionally compact so portrait videos do not take over the page.

If you want a visible caption under the video, wrap it in `figure` and use `figcaption`.

Example:

```html
<figure>
  <video class="post-video" controls preload="metadata">
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
