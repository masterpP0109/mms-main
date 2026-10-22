import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Use the existing white/red MMS wordmark without the small tagline.
const source = fileURLToPath(new URL("../public/mms/MMS%20LOGO.png", import.meta.url));
const metadata = await sharp(source).metadata();
const cropped = await sharp(source)
  .extract({ left: 0, top: 0, width: metadata.width, height: Math.ceil(metadata.height * 0.6) })
  .png()
  .toBuffer();
const wordmark = await sharp(cropped).trim().png().toBuffer();

async function icon(size) {
  const mark = await sharp(wordmark)
    .resize({ width: Math.round(size * 0.9), height: Math.round(size * 0.9), fit: "inside" })
    .png()
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: "#050507" } })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toBuffer();
}

await writeFile(new URL("../app/icon.png", import.meta.url), await icon(512));
await writeFile(new URL("../app/apple-icon.png", import.meta.url), await icon(180));

// ICO directory containing PNG images for standard browser tab sizes.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(icon));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, index) => {
  const entry = 6 + index * 16;
  header[entry] = size;
  header[entry + 1] = size;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(images[index].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += images[index].length;
});
await writeFile(new URL("../app/favicon.ico", import.meta.url), Buffer.concat([header, ...images]));
console.log("Generated MMS favicon, site icon, and Apple touch icon.");
