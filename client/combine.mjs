import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, "combined-code.txt");
const ROOT_DIR = path.join(__dirname, "src");

const supportedExtensions = [".js", ".jsx", ".css"];

async function combineFiles(dir, output = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await combineFiles(fullPath, output);
    } else if (supportedExtensions.includes(path.extname(entry.name))) {
      const relativePath = path.relative(__dirname, fullPath);
      const content = await readFile(fullPath, "utf-8");
      output.push(`\n// --- File: ${relativePath} ---\n\n${content}`);
    }
  }

  return output;
}

async function main() {
  try {
    const output = await combineFiles(ROOT_DIR);
    await writeFile(OUTPUT_FILE, output.join("\n"), "utf-8");
    console.log(`✅ Combined code written to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Error combining files:", error);
  }
}

await main();
