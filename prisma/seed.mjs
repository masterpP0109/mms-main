// Same reviewed snapshot import as content:import; dry-run unless --apply is explicit.
import { createRequire } from "node:module";
createRequire(import.meta.url)("../scripts/import-current-content.cjs");
