const assert = require("node:assert/strict");
const test = require("node:test");

async function loadHomepagePhoto() {
  return import("../netlify/edge-functions/homepage-photo.js");
}

test("applyRandomHomePhoto swaps the homepage image from embedded JSON", async () => {
  const { applyRandomHomePhoto } = await loadHomepagePhoto();
  const html = `
    <p class="homepage-photo">
      <img id="homepage-photo-img" src="/assets/images/home/a.webp" srcset="/a-640.webp 640w" sizes="42rem" alt="A photo from home" width="1280" height="960">
    </p>
    <script type="application/json" id="homepage-photos">[{"url":"/assets/images/home/b.webp","srcset":"/b-640.webp 640w, /b.webp 1280w","sizes":"42rem","width":1280,"height":1707}]</script>
  `;

  const output = applyRandomHomePhoto(html, () => 0);

  assert.match(output, /id="homepage-photo-img"/);
  assert.match(output, /data-home-photo-picked/);
  assert.match(output, /src="\/assets\/images\/home\/b.webp"/);
  assert.match(output, /srcset="\/b-640.webp 640w, \/b.webp 1280w"/);
  assert.match(output, /width="1280"/);
  assert.match(output, /height="1707"/);
  assert.doesNotMatch(output, /src="\/assets\/images\/home\/a.webp"/);
});

test("applyRandomHomePhoto leaves unmatched HTML alone", async () => {
  const { applyRandomHomePhoto } = await loadHomepagePhoto();
  const html = "<p>No homepage photo</p>";
  assert.equal(applyRandomHomePhoto(html), html);
});
