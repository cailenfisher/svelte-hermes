#!/usr/bin/env node
import { existsSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve the consumer project root (where this package was installed into)
// When running as a postinstall hook, cwd is the consumer's project root.
const projectRoot = process.env.INIT_CWD || process.env.npm_config_local_prefix || process.cwd();
const targetDir = join(projectRoot, 'supabase', 'schemas');
const sourceDir = join(__dirname, '..', 'static', 'schemas');

console.log(`[svelte-hermes] attempting to copy required schema files into your project.`);

if (!existsSync(sourceDir)) {
	console.warn('[svelte-hermes] Schema source directory not found, skipping schema copy.');
	process.exit(0);
}

if (!existsSync(targetDir)) {
	mkdirSync(targetDir, { recursive: true });
}

const files = readdirSync(sourceDir).filter((f) => f.endsWith('.sql'));

if (files.length < 1) {
	console.error(`[svelte-hermes] No source schema files!`);
}

for (const file of files) {
	const dest = join(targetDir, file);
	if (existsSync(dest)) {
		console.log(`[svelte-hermes] Skipping ${file} (already exists)`);
		continue;
	}
	copyFileSync(join(sourceDir, file), dest);
	console.log(`[svelte-hermes] Copied ${file} → supabase/schemas/${file}`);
}
