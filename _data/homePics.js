const fs = require("node:fs");
const path = require("node:path");
const { getLocalImageDimensions } = require("../scripts/media-dimensions.cjs");

const HOME_PIC_DIR = path.join(__dirname, "..", "assets", "images", "home");
const PUBLIC_PREFIX = "/assets/images/home";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const DERIVATIVE_NAME = /-\d+\.webp$/i;
const SIZES = "(max-width: 42rem) calc(100vw - 2rem), 42rem";

function toPublicUrl(name) {
  return `${PUBLIC_PREFIX}/${name}`;
}

function derivativeName(name, width) {
  const stem = path.basename(name, path.extname(name));
  return `${stem}-${width}.webp`;
}

module.exports = function homePics() {
  if (!fs.existsSync(HOME_PIC_DIR)) {
    return [];
  }

  const names = new Set(
    fs
      .readdirSync(HOME_PIC_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name),
  );

  return [...names]
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()) && !DERIVATIVE_NAME.test(name))
    .sort((left, right) => left.localeCompare(right))
    .flatMap((name) => {
      const url = toPublicUrl(name);
      const dimensions = getLocalImageDimensions(url);
      if (!dimensions) {
        return [];
      }

      const srcsetParts = [`${url} ${dimensions.width}w`];
      const smallName = derivativeName(name, 640);
      if (names.has(smallName)) {
        const smallUrl = toPublicUrl(smallName);
        const smallDimensions = getLocalImageDimensions(smallUrl);
        if (smallDimensions) {
          srcsetParts.unshift(`${smallUrl} ${smallDimensions.width}w`);
        }
      }

      return [
        {
          url,
          srcset: srcsetParts.join(", "),
          sizes: SIZES,
          width: dimensions.width,
          height: dimensions.height,
        },
      ];
    });
};
