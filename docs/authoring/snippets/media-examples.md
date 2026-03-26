## Markdown Image

```md
![Alt text](/assets/images/example.webp)
```

## HTML Image With Caption

```html
<figure>
  <img src="/assets/images/example.webp" alt="Alt text" width="500">
  <figcaption>A short caption</figcaption>
</figure>
```

## Self-Hosted Video

```html
<figure>
  <video class="post-video" controls preload="metadata">
    <source src="/assets/videos/posts/my-post/walk.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>A short caption</figcaption>
</figure>
```

## Embedded Video From YouTube

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
