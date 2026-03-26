const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { injectIntrinsicImageDimensions, normalizeFeedMedia } = require("./feed-media.cjs");

const rootDir = path.resolve(__dirname, "..");

test("local images without dimensions get capped for feed output", () => {
  const html = '<p><img src="/assets/images/posts/travel-type/nainital-2.jpg" alt="Raj Bhavan"></p>';
  const output = normalizeFeedMedia(html, { postUrl: "/travel-type/", rootDir });

  assert.match(output, /width="640"/);
  assert.match(output, /height="480"/);
  assert.match(output, /style="[^"]*max-width: 100%[^"]*height: auto[^"]*"/);
});

test("explicit image dimensions are preserved in feed output", () => {
  const html = '<p><img src="/assets/images/posts/travel-type/nainital-2.jpg" alt="Raj Bhavan" width="300"></p>';
  const output = normalizeFeedMedia(html, { postUrl: "/travel-type/", rootDir });

  assert.match(output, /width="300"/);
  assert.doesNotMatch(output, /height="480"/);
});

test("EXIF-rotated images keep the correct aspect ratio", () => {
  const html = '<p><img src="/assets/images/posts/travel-type/nainital-1.jpg" alt="Trees"></p>';
  const output = normalizeFeedMedia(html, { postUrl: "/travel-type/", rootDir });

  assert.match(output, /width="480"/);
  assert.match(output, /height="640"/);
});

test("videos with a poster become linked poster previews in the feed", () => {
  const html = `
    <figure>
      <video controls preload="metadata" poster="/assets/images/posts/travel-type/nirvana-hills-hotel-goa-poster.jpg">
        <source src="/assets/videos/posts/travel-type/nirvana-hills-hotel-goa.mp4" type="video/mp4">
      </video>
      <figcaption>Nirvana Hill Resort, Goa</figcaption>
    </figure>
  `;
  const output = normalizeFeedMedia(html, { postUrl: "/travel-type/", rootDir });

  assert.doesNotMatch(output, /<video\b/);
  assert.match(output, /<a href="\/travel-type\/"><img/);
  assert.match(output, /nirvana-hills-hotel-goa-poster\.jpg/);
  assert.match(output, /width="360"/);
  assert.match(output, /height="640"/);
  assert.match(output, /Nirvana Hill Resort, Goa/);
  assert.match(output, /Watch video on site/);
});

test("videos without a poster fall back to a post link", () => {
  const html = '<video controls><source src="/assets/videos/posts/travel-type/nirvana-hills-hotel-goa.mp4" type="video/mp4"></video>';
  const output = normalizeFeedMedia(html, { postUrl: "/travel-type/", rootDir });

  assert.doesNotMatch(output, /<video\b/);
  assert.match(output, /<p><a href="\/travel-type\/">Watch video on site<\/a><\/p>/);
});

test("iframe embeds fall back to a post link", () => {
  const html = '<iframe src="https://www.youtube.com/embed/123" title="Example video"></iframe>';
  const output = normalizeFeedMedia(html, { postUrl: "/travel-type/", rootDir });

  assert.doesNotMatch(output, /<iframe\b/);
  assert.match(output, /Open embedded media on site/);
});

test("page output gets intrinsic width and height for local images", () => {
  const html = '<p><img src="/assets/images/posts/travel-type/nainital-1.jpg" alt="Trees"></p>';
  const output = injectIntrinsicImageDimensions(html, { rootDir });

  assert.match(output, /width="3024"/);
  assert.match(output, /height="4032"/);
});
