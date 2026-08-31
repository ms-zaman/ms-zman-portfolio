/**
 * Regenerates the AVIF cloud cut-outs in public/sky/ from the PNG masters.
 *
 * The PNGs stay in the repo as the <picture> fallback and as the masters — do not
 * delete them. Run after re-exporting a cloud:  node scripts/build-sky-assets.mjs
 *
 * Widths are set by the largest size the clouds are ever rendered at (560 CSS px,
 * fixed at every breakpoint) doubled for DPR2. cloud-1's master is 2048w, so it
 * downscales; cloud-2's is already 1024w and is only re-encoded.
 */
import sharp from 'sharp';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../public/sky/', import.meta.url));
const TARGETS = [
  { name: 'cloud-1', width: 1120 },
  { name: 'cloud-2', width: null }, // master is 1024w already — wide enough
];

for (const { name, width } of TARGETS) {
  const png = `${DIR}${name}.png`;
  const avif = `${DIR}${name}.avif`;
  let img = sharp(png);
  if (width) img = img.resize({ width });
  await img.avif({ quality: 58, effort: 6 }).toFile(avif);
  const before = statSync(png).size;
  const after = statSync(avif).size;
  console.log(
    `${name}: ${(before / 1024).toFixed(1)} KB png → ${(after / 1024).toFixed(1)} KB avif ` +
      `(${(100 - (after / before) * 100).toFixed(0)}% smaller)`,
  );
}
