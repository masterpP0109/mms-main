import { readdir, readFile, writeFile, stat, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Preserve public URLs already stored in PostgreSQL; next/image negotiates WebP.
const root = process.cwd();
const report = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    if (!/\.jpe?g$/i.test(file)) continue;
    const size = (await stat(file)).size;
    if (size < 5_000_000) continue;
    const source = await readFile(file);
    const metadata = await sharp(source).metadata();
    const optimized = await sharp(source).rotate().resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    if (optimized.length >= size) continue;
    const relative = path.relative(root, file);
    if (process.argv.includes("--apply")) {
      const backup = path.join(root, ".private-assets", "original-media", relative);
      await mkdir(path.dirname(backup), { recursive: true });
      await copyFile(file, backup, 1);
      await writeFile(file, optimized);
    }
    report.push({ path: relative, before: size, after: optimized.length, originalWidth: metadata.width, originalHeight: metadata.height });
  }
}
await walk(path.join(root, "public"));
await writeFile("MEDIA_OPTIMIZATION.json", JSON.stringify({ applied: process.argv.includes("--apply"), images: report, before: report.reduce((sum, item) => sum + item.before, 0), after: report.reduce((sum, item) => sum + item.after, 0) }, null, 2) + "\n");
console.log(`Reviewed ${report.length} oversized photographs. ${process.argv.includes("--apply") ? "Optimized; originals archived privately." : "Dry run only."}`);
