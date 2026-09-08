const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const HOME_PIC_DIR = path.join(__dirname, "..", "assets", "images", "home");
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const DERIVATIVE_NAME = /-\d+\.webp$/i;
const OUTPUTS = [
  { width: 640, suffix: "-640" },
  { width: 1280, suffix: "" },
];

function listSourceFiles() {
  if (!fs.existsSync(HOME_PIC_DIR)) {
    return [];
  }

  return fs
    .readdirSync(HOME_PIC_DIR, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isFile()) {
        return false;
      }

      const extension = path.extname(entry.name).toLowerCase();
      return SOURCE_EXTENSIONS.has(extension) && !DERIVATIVE_NAME.test(entry.name);
    })
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

async function optimizeFile(name) {
  const inputPath = path.join(HOME_PIC_DIR, name);
  const stem = path.basename(name, path.extname(name));
  const outputs = [];

  for (const output of OUTPUTS) {
    const outputName = `${stem}${output.suffix}.webp`;
    const outputPath = path.join(HOME_PIC_DIR, outputName);
    const tempPath = `${outputPath}.tmp.webp`;

    await sharp(inputPath)
      .rotate()
      .resize({ width: output.width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(tempPath);

    fs.renameSync(tempPath, outputPath);
    outputs.push(outputName);
  }

  const keep = new Set(outputs);
  if (!keep.has(name)) {
    fs.unlinkSync(inputPath);
  }

  return outputs;
}

async function main() {
  const sources = listSourceFiles();
  if (sources.length === 0) {
    console.log("No homepage photos found in assets/images/home/.");
    return;
  }

  for (const name of sources) {
    const outputs = await optimizeFile(name);
    console.log(`${name} -> ${outputs.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
