// Reads the brand hue of every 3D icon out of the icon itself and prints a
// ready-to-paste map for `accentHue` in src/app/about/tech-items.ts.
//
//   node scripts/sample-tech-hues.mjs
//
// The About Me 3D card paints itself from that one number (plate gradient,
// shadow, text and the official-site pill all derive from it), so when an icon
// in public/images/tech is replaced, re-run this and update the entry.
//
// Method: a 10° hue histogram over the icon's vivid pixels — saturation
// low enough to skip the white plate and the black outlines, lightness in the
// middle so highlights and shadows do not skew it. The winning bin's weighted
// mean is the hue; a plain average across the whole icon would blend a
// two-tone mark (blue + yellow) into a colour that is in neither.
//
// A mark with almost no coloured pixels at all is monochrome (GitHub, Next.js:
// black on black). Those two have no brand hue to sample, so the script reads
// the ink colour instead and prints the `plateTone: "dark"` they carry — the
// card takes the logo's own dark tone rather than a saturated plate.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ICON_DIR = "public/images/tech";
const VIVID_SATURATION = 0.12;
const MONOCHROME_SHARE = 0.3;

const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
};

const files = fs
  .readdirSync(ICON_DIR)
  .filter((name) => name.endsWith(".webp"))
  .sort();

const rows = [];
for (const file of files) {
  const { data, info } = await sharp(path.join(ICON_DIR, file))
    .resize(64, 64, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bins = new Array(36).fill(0);
  const sums = Array.from({ length: 36 }, () => [0, 0]);
  // The mark's ink: the mean of its dark pixels, which is the tone a
  // monochrome card's plate imitates.
  const ink = [0, 0, 0];
  let inkCount = 0;
  let opaque = 0;
  let vivid = 0;

  for (let i = 0; i < data.length; i += info.channels) {
    const alpha = info.channels === 4 ? data[i + 3] : 255;
    if (alpha < 200) continue;
    opaque++;
    const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    if (l < 0.35) {
      ink[0] += data[i];
      ink[1] += data[i + 1];
      ink[2] += data[i + 2];
      inkCount++;
    }
    if (l < 0.1 || l > 0.92 || s < VIVID_SATURATION) continue;
    vivid++;
    const weight = Math.pow(s, 1.5) * (1 - Math.abs(l - 0.5) * 1.2);
    if (weight <= 0) continue;
    const bin = Math.floor(h / 10) % 36;
    const rad = (h * Math.PI) / 180;
    bins[bin] += weight;
    sums[bin][0] += Math.cos(rad) * weight;
    sums[bin][1] += Math.sin(rad) * weight;
  }

  let best = 0;
  for (let b = 1; b < 36; b++) if (bins[b] > bins[best]) best = b;
  const hue = ((Math.atan2(sums[best][1], sums[best][0]) * 180) / Math.PI + 360) % 360;
  const mean = inkCount ? ink.map((value) => Math.round(value / inkCount)) : [0, 0, 0];
  const [inkHue] = rgbToHsl(mean[0], mean[1], mean[2]);

  rows.push({
    id: file.replace(".webp", ""),
    hue: Math.round(hue),
    vividShare: opaque ? vivid / opaque : 0,
    ink: "#" + mean.map((v) => v.toString(16).padStart(2, "0")).join(""),
    inkHue: Math.round(inkHue),
  });
}

const width = Math.max(...rows.map((row) => row.id.length));
for (const row of rows) {
  // No colour to sample: the plate takes the mark's own dark tone instead.
  if (row.vividShare < MONOCHROME_SHARE) {
    console.log(
      `${row.id.padEnd(width)}  plateTone: "dark", accentHue: ${String(row.inkHue).padStart(3)}   (ink ${row.ink}, ${Math.round(row.vividShare * 100)}% of the icon is coloured — monochrome)`,
    );
    continue;
  }
  console.log(
    `${row.id.padEnd(width)}  accentHue: ${String(row.hue).padStart(3)}   (${Math.round(row.vividShare * 100)}% of the icon is coloured)`,
  );
}
