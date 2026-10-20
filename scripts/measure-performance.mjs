import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
process.env.PLAYWRIGHT_BROWSERS_PATH ||= ".cache/ms-playwright";
const { chromium } = await import("@playwright/test");
const server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", "3101"], { windowsHide: true, stdio: "ignore", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", SMTP_PASSWORD: "", WHATSAPP_ACCESS_TOKEN: "", CRON_SECRET: "" } });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    try { if ((await fetch("http://127.0.0.1:3101")).ok) { ready = true; break; } } catch { /* Wait for local production startup. */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error("Production server not ready; run npm run build first and check port 3101.");
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.addInitScript(() => {
    window.mmsMetrics = { lcpMs: 0, cls: 0 };
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.mmsMetrics.lcpMs = entry.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.mmsMetrics.cls += entry.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("http://127.0.0.1:3101", { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(resolve => setTimeout(resolve, 1500));
  const measured = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource");
    const images = resources.filter(entry => entry.initiatorType === "img" || entry.name.includes("/_next/image?"));
    const scripts = resources.filter(entry => /\.js(?:\?|$)/.test(entry.name));
    return { ...window.mmsMetrics, imageTransferBytes: images.reduce((sum, entry) => sum + entry.transferSize, 0), javaScriptTransferBytes: scripts.reduce((sum, entry) => sum + entry.transferSize, 0), imageRequests: images.length, javaScriptRequests: scripts.length };
  });
  const report = { measuredAt: new Date().toISOString(), nextVersion: require("next/package.json").version, viewport: { width: 1440, height: 900 }, conditions: "Single local production Chromium run; fresh browser context, no network/CPU throttling, reduced motion. Server image cache may be warm. This is not field performance or a Lighthouse score.", ...measured, inpMs: null, inpLimitation: "No representative interaction sample; INP not measured." };
  await writeFile("PERFORMANCE_REPORT.json", JSON.stringify(report, null, 2) + "\n");
  await page.screenshot({ path: ".private-assets/production-home-1440.png" });
  console.log(report);
} finally { await browser?.close(); server.kill(); }
