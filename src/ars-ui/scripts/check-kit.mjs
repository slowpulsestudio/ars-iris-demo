// Structural checks for the ARS UI kit. Run with `pnpm check`; exits 1 on any failure.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const kit = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const iris = path.resolve(kit, '../iris-shell/src');
const audit = path.resolve(kit, '../../docs/ars-component-map.md');

const failures = [];
const fail = (msg) => failures.push(msg);
const read = (p) => fs.readFileSync(p, 'utf8');
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)],
  );

// Iris tokens and icons that exist.
const irisCss = walk(iris).filter((f) => f.endsWith('.css')).map(read).join('\n');
const definedTokens = new Set([...irisCss.matchAll(/(--oi-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const icons = new Set([...read(path.join(iris, 'icons/manifest.json')).matchAll(/"name": "([^"]+)"/g)].map((m) => m[1]));

// Figma name -> ID from the audit.
const auditIds = new Map(
  [...read(audit).matchAll(/^### (.+)\nFigma ID (\S+)/gm)].map((m) => [m[1].trim(), m[2]]),
);

const src = path.join(kit, 'src');
const index = read(path.join(src, 'index.ts'));

// Components used by the CRUD screens that are not in ARS - Primary (src/missingFromFigma.ts).
const missing = [
  ...read(path.join(src, 'missingFromFigma.ts')).matchAll(
    /component: '([^']+)',\s*figmaName: '([^']+)',\s*figmaNodeId: '([^']+)'/g,
  ),
].map((m) => ({ component: m[1], figmaName: m[2], figmaNodeId: m[3] }));
const MISSING_PREFIX = 'ARS/Missing from Figma/';
const files = walk(src);
const components = fs.readdirSync(path.join(src, 'components'));

for (const name of components) {
  const dir = path.join(src, 'components', name);
  if (!/^ARS[A-Z]/.test(name)) fail(`${name}: name must start with "ARS" in capitals`);
  for (const ext of ['.tsx', '.module.css', '.stories.tsx']) {
    if (!fs.existsSync(path.join(dir, name + ext)) && !(ext === '.module.css' && !read(path.join(dir, `${name}.tsx`)).includes('.module.css'))) {
      fail(`${name}: missing ${name}${ext}`);
    }
  }
  if (!index.includes(`./components/${name}/${name}.js`)) fail(`${name}: not exported from src/index.ts`);
  const storyPath = path.join(dir, `${name}.stories.tsx`);
  if (fs.existsSync(storyPath)) {
    const story = read(storyPath);
    const title = story.match(/title: '([^']+)'/)?.[1];
    const entry = missing.find((m) => m.component === name);
    if (entry) {
      if (title !== `${MISSING_PREFIX}${entry.figmaName}`) fail(`${name}: story title must be "${MISSING_PREFIX}${entry.figmaName}"`);
      if (!story.includes(entry.figmaNodeId)) fail(`${name}: story doesn't cite Figma ID ${entry.figmaNodeId}`);
      if (!story.includes("'missing-from-figma'")) fail(`${name}: story needs the missing-from-figma tag`);
      continue;
    }
    if (title?.startsWith(MISSING_PREFIX)) fail(`${name}: not listed in src/missingFromFigma.ts`);
    const figmaName = title?.replace(/^ARS\//, '');
    if (!title?.startsWith('ARS/')) fail(`${name}: story title must start with "ARS/"`);
    else if (!auditIds.has(figmaName)) fail(`${name}: story title "${figmaName}" is not a component in the audit`);
    else if (!story.includes(auditIds.get(figmaName))) fail(`${name}: story doesn't cite Figma ID ${auditIds.get(figmaName)}`);
  }
}

for (const file of files) {
  const rel = path.relative(kit, file);
  const text = read(file);
  if (/\bArs[A-Z]/.test(text)) fail(`${rel}: "Ars" in mixed case — use ARS`);
  if (file.endsWith('.css')) {
    const noComments = text.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of noComments.matchAll(/var\((--oi-[a-z0-9-]+)/g)) {
      if (!definedTokens.has(m[1])) fail(`${rel}: unknown Iris token ${m[1]}`);
    }
    if (/#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(noComments)) fail(`${rel}: hard-coded colour — use an Iris token`);
  }
  if (file.endsWith('.tsx')) {
    for (const m of text.matchAll(/\b(?:name|icon|iconLead|iconTrail)=["']([A-Z][A-Za-z0-9]+)["']|\bicon: '([A-Z][A-Za-z0-9]+)'|\bicon = '([A-Z][A-Za-z0-9]+)'/g)) {
      const icon = m[1] ?? m[2] ?? m[3];
      if (!icons.has(icon)) fail(`${rel}: unknown Iris icon "${icon}"`);
    }
  }
}

console.log(`Checked ${components.length} components and ${files.length} files.`);
if (failures.length) {
  for (const f of failures) console.log(`FAIL ${f}`);
  process.exit(1);
}
console.log('All kit checks passed.');
