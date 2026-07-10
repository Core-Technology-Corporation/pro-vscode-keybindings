'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const distFile = path.join(distDir, 'keybindings.json');
const packageFile = path.join(rootDir, 'package.json');

function normalizeKey(key) {
  return key
    .split('+')
    .map((part) => part.trim().toLowerCase())
    .sort()
    .join('+');
}

function loadKeybindings() {
  const files = fs
    .readdirSync(srcDir)
    .filter((file) => file.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    throw new Error(`No .json files found in ${srcDir}`);
  }

  const all = [];
  const seen = new Map();

  for (const file of files) {
    const filePath = path.join(srcDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    let entries;
    try {
      entries = JSON.parse(raw);
    } catch (err) {
      throw new Error(`Invalid JSON in ${file}: ${err.message}`);
    }
    if (!Array.isArray(entries)) {
      throw new Error(`${file} must export a JSON array of keybindings`);
    }

    for (const entry of entries) {
      if (!entry.key || !entry.command) {
        throw new Error(`${file} has an entry missing "key" or "command": ${JSON.stringify(entry)}`);
      }

      const dedupeId = `${normalizeKey(entry.key)}|${entry.when || ''}`;
      if (seen.has(dedupeId)) {
        throw new Error(
          `Duplicate keybinding "${entry.key}" in ${file} (already defined in ${seen.get(dedupeId)})`
        );
      }
      seen.set(dedupeId, file);

      all.push(entry);
    }
  }

  return all;
}

function writeDist(keybindings) {
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(distFile, JSON.stringify(keybindings, null, 2) + '\n', 'utf8');
}

function updatePackageJson(keybindings) {
  const raw = fs.readFileSync(packageFile, 'utf8');
  const pkg = JSON.parse(raw);

  pkg.contributes = pkg.contributes || {};
  pkg.contributes.keybindings = keybindings;

  fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

function main() {
  const keybindings = loadKeybindings();
  writeDist(keybindings);
  updatePackageJson(keybindings);
  console.log(`Built ${keybindings.length} keybindings -> dist/keybindings.json and package.json`);
}

main();
