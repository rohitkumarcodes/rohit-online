const fs = require("node:fs");
const path = require("node:path");
const { imageSize } = require("image-size");

const DIMENSION_CACHE = new Map();
const ORIENTATION_SWAP_VALUES = new Set([5, 6, 7, 8]);
const LOCAL_ASSET_PREFIX = "/assets/";

function stripUrlSuffix(src) {
  return String(src || "").split(/[?#]/, 1)[0];
}

function resolveLocalAssetPath(src, rootDir = process.cwd()) {
  const cleanSrc = stripUrlSuffix(src);
  if (!cleanSrc.startsWith(LOCAL_ASSET_PREFIX)) {
    return null;
  }

  return path.join(rootDir, cleanSrc);
}

function normalizeDimensions(dimensions) {
  if (!dimensions || typeof dimensions.width !== "number" || typeof dimensions.height !== "number") {
    return null;
  }

  let { width, height } = dimensions;
  if (ORIENTATION_SWAP_VALUES.has(dimensions.orientation)) {
    [width, height] = [height, width];
  }

  return { width, height };
}

function getLocalImageDimensions(src, options = {}) {
  const filePath = resolveLocalAssetPath(src, options.rootDir);
  if (!filePath) {
    return null;
  }

  if (DIMENSION_CACHE.has(filePath)) {
    return DIMENSION_CACHE.get(filePath);
  }

  let dimensions = null;
  try {
    dimensions = normalizeDimensions(imageSize(fs.readFileSync(filePath)));
  } catch {
    dimensions = null;
  }

  DIMENSION_CACHE.set(filePath, dimensions);
  return dimensions;
}

function capDimensions(dimensions, maxWidth, maxHeight) {
  if (!dimensions) {
    return null;
  }

  const scale = Math.min(maxWidth / dimensions.width, maxHeight / dimensions.height, 1);
  return {
    width: Math.round(dimensions.width * scale),
    height: Math.round(dimensions.height * scale),
  };
}

module.exports = {
  capDimensions,
  getLocalImageDimensions,
  resolveLocalAssetPath,
};
