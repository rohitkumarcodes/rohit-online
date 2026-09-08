const fs = require("node:fs");
const path = require("node:path");
const { getLocalImageDimensions } = require("../scripts/media-dimensions.cjs");

const HOME_PIC_DIR = path.join(__dirname, "..", "assets", "images", "home");
const PUBLIC_PREFIX = "/assets/images/home";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

module.exports = function homePics() {
  if (!fs.existsSync(HOME_PIC_DIR)) {
    return [];
  }

  return fs
    .readdirSync(HOME_PIC_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right))
    .flatMap((name) => {
      const url = `${PUBLIC_PREFIX}/${name}`;
      const dimensions = getLocalImageDimensions(url);
      if (!dimensions) {
        return [];
      }

      return [
        {
          url,
          width: dimensions.width,
          height: dimensions.height,
        },
      ];
    });
};
