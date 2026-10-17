/* eslint-disable @typescript-eslint/no-require-imports -- explicit Node import CLI */
// Import the currently approved snapshots without overwriting any staff edits.
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");
const path = require("node:path");
require("@next/env").loadEnvConfig(process.cwd());
function loadSnapshot(file) {
  const loaded = new Module(path.resolve(file));
  loaded.paths = Module._nodeModulePaths(process.cwd());
  loaded._compile(ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, path.resolve(file));
  return loaded.exports;
}
const { services, contentSlug } = loadSnapshot("lib/services.ts");
const { projectSnapshot } = loadSnapshot("lib/project-snapshot.ts");
async function run() {
  if (!process.argv.includes("--apply")) {
    console.log(`Dry run: ${services.length} services, ${projectSnapshot.length} projects. Use --apply against a reviewed staging database first. Existing slugs will not be overwritten.`);
    return;
  }
  const { PrismaClient } = require("@prisma/client");
  const db = new PrismaClient();
  try {
    await db.$transaction(async tx => {
      for (const [sortOrder, item] of services.entries()) {
        const slug = contentSlug(item.title);
        await tx.service.upsert({ where: { slug }, update: {}, create: { slug, title: item.title, category: item.tag, description: item.desc, heroImage: item.image, gallery: item.gallery, features: item.items.map(feature => feature.label), ctaLabel: item.cta, sortOrder } });
      }
      for (const [sortOrder, item] of projectSnapshot.entries()) {
        const slug = contentSlug(item.title);
        await tx.project.upsert({ where: { slug }, update: {}, create: { slug, title: item.title, category: item.category, description: item.desc, year: Number(item.year), heroImage: item.image, gallery: item.images, tags: item.tags, sortOrder } });
      }
    }, { timeout: 30000 });
    console.log("Imported missing content. Existing records preserved.");
  } finally { await db.$disconnect(); }
}
run().catch(() => { console.error("Content import failed; transaction rolled back. Check database configuration privately."); process.exitCode = 1; });
