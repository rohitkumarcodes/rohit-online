const PHOTOS_JSON_RE =
  /<script type="application\/json" id="homepage-photos">([\s\S]*?)<\/script>/;
const HOME_PHOTO_IMG_RE = /<img\b[^>]*\bid="homepage-photo-img"[^>]*>/;

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function pickHomePhoto(photos, random = Math.random) {
  if (!Array.isArray(photos) || photos.length === 0) {
    return null;
  }

  return photos[Math.floor(random() * photos.length)] || null;
}

export function renderHomePhotoTag(photo) {
  return `<img id="homepage-photo-img" src="${escapeAttr(photo.url)}" srcset="${escapeAttr(photo.srcset)}" sizes="${escapeAttr(photo.sizes)}" alt="A photo from home" width="${escapeAttr(photo.width)}" height="${escapeAttr(photo.height)}" decoding="async" fetchpriority="high">`;
}

export function applyRandomHomePhoto(html, random = Math.random) {
  const jsonMatch = html.match(PHOTOS_JSON_RE);
  if (!jsonMatch) {
    return html;
  }

  let photos;
  try {
    photos = JSON.parse(jsonMatch[1]);
  } catch {
    return html;
  }

  const photo = pickHomePhoto(photos, random);
  if (!photo || !photo.url || !HOME_PHOTO_IMG_RE.test(html)) {
    return html;
  }

  return html.replace(HOME_PHOTO_IMG_RE, renderHomePhotoTag(photo));
}

export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const html = await response.text();
  const nextHtml = applyRandomHomePhoto(html);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("etag");
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.set("Netlify-CDN-Cache-Control", "no-store");

  return new Response(nextHtml, {
    status: response.status,
    headers,
  });
};

export const config = {
  onError: "bypass",
};
