import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const missing = new Map();
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(tsx?|mjs|json)$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name)) {
      const text = await readFile(file, "utf8");
      for (const match of text.matchAll(/["'`]((?:\/mms\/|\/services(?:%20| )images\/|\/)[^"'`\n]+\.(?:jpe?g|png|webp|avif|svg|gif))(?:["'`])/gi)) {
        const url = decodeURIComponent(match[1]);
        try { await stat(path.join(root, "public", url)); }
        catch { missing.set(match[1], [...(missing.get(match[1]) ?? []), path.relative(root, file)]); }
      }
    }
  }
}
for (const directory of ["app", "lib", "prisma"]) await walk(path.join(root, directory));
if (missing.size) {
  for (const [url, files] of missing) console.error(`${url}: ${[...new Set(files)].join(", ")}`);
  process.exitCode = 1;
} else console.log("All static public media references exist.");
