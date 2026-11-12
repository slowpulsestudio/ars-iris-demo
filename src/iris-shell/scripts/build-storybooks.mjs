// Builds the Iris, ARS and Iris new Storybooks into dist/storybook/{iris,ars,iris-new}, so the deployed app can link to them.
// Run after `vite build` (see vercel.json). Each Storybook is its own pnpm project, so it installs its own packages first.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
if (!existsSync(dist)) {
  console.error('build-storybooks: dist/ is missing. Run `pnpm build` first.');
  process.exit(1);
}

const storybooks = [
  { id: 'iris', dir: fileURLToPath(new URL('../../iris-storybook', import.meta.url)) },
  { id: 'ars', dir: fileURLToPath(new URL('../../ars-ui', import.meta.url)) },
  { id: 'iris-new', dir: fileURLToPath(new URL('../../iris-new', import.meta.url)) },
];

for (const { id, dir } of storybooks) {
  const out = `${dist}/storybook/${id}`;
  console.log(`build-storybooks: ${id} -> ${out}`);
  execFileSync('pnpm', ['install', '--frozen-lockfile'], { cwd: dir, stdio: 'inherit' });
  execFileSync('pnpm', ['exec', 'storybook', 'build', '--quiet', '-o', out], { cwd: dir, stdio: 'inherit' });
  if (!existsSync(`${out}/index.html`)) {
    console.error(`build-storybooks: ${out}/index.html was not written.`);
    process.exit(1);
  }
}
