// Structural checks for the Iris Storybook. Run with `pnpm check`; exits 1 on any failure.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const iris = path.resolve(pkg, '../iris-shell/src');

const failures = [];
const fail = (msg) => failures.push(msg);
const read = (p) => fs.readFileSync(p, 'utf8');
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)],
  );

const irisCss = walk(iris).filter((f) => f.endsWith('.css')).map(read).join('\n');
const definedTokens = new Set([...irisCss.matchAll(/(--oi-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const icons = new Set([...read(path.join(iris, 'icons/manifest.json')).matchAll(/"name": "([^"]+)"/g)].map((m) => m[1]));

const components = fs
  .readdirSync(path.join(iris, 'components'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const src = path.join(pkg, 'src');
const stories = fs.readdirSync(src).filter((f) => f.endsWith('.stories.tsx'));

for (const name of components) {
  if (!stories.includes(`${name}.stories.tsx`)) fail(`${name}: no story file src/${name}.stories.tsx`);
}

for (const file of stories) {
  const name = file.replace('.stories.tsx', '');
  const text = read(path.join(src, file));
  if (!components.includes(name)) fail(`${file}: no Iris component called ${name}`);
  if (!text.includes(`title: 'Iris/${name}'`)) fail(`${file}: story title must be 'Iris/${name}'`);
  if (!text.includes(`'@iris/components/${name}/`)) fail(`${file}: must import the component from @iris/components/${name}/`);
  if (/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/.test(text.replace(/\/\/.*$/gm, ''))) {
    fail(`${file}: hard-coded colour — use an Iris token`);
  }
  for (const m of text.matchAll(/var\((--oi-[a-z0-9-]+)/g)) {
    if (!definedTokens.has(m[1])) fail(`${file}: unknown Iris token ${m[1]}`);
  }
  for (const m of text.matchAll(/\b(?:name|icon|iconLead|iconTrail)=["']([A-Z][A-Za-z0-9]+)["']|\bicon: '([A-Z][A-Za-z0-9]+)'/g)) {
    const icon = m[1] ?? m[2];
    if (!icons.has(icon)) fail(`${file}: unknown Iris icon "${icon}"`);
  }
}

console.log(`Checked ${stories.length} story files against ${components.length} Iris components.`);
if (failures.length) {
  for (const f of failures) console.log(`FAIL ${f}`);
  process.exit(1);
}
console.log('All story checks passed.');
