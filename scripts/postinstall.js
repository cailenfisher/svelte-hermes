#!/usr/bin/env node
import { existsSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve the consumer project root (where this package was installed into)
// When running as a postinstall hook, cwd is the consumer's project root.
const targetDir = join(process.cwd(), 'supabase', 'schemas');
const sourceDir = join(__dirname, '..', 'static', 'schemas');

if (!existsSync(sourceDir)) {
  console.warn('[svelte-hermes] Schema source directory not found, skipping schema copy.');
  process.exit(0);
}

if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

const files = readdirSync(sourceDir).filter((f) => f.endsWith('.sql'));

for (const file of files) {
  const dest = join(targetDir, file);
  if (existsSync(dest)) {
    console.log(`[svelte-hermes] Skipping ${file} (already exists)`);
    continue;
  }
  copyFileSync(join(sourceDir, file), dest);
  console.log(`[svelte-hermes] Copied ${file} → supabase/schemas/${file}`);
}
