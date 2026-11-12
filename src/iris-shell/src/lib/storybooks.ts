/** A Storybook listed on the Storybooks page (#/storybooks). */
export interface StorybookLink {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  href: string;
}

// While developing, the local servers (ports match the `storybook` scripts in src/iris-storybook,
// src/ars-ui and src/iris-new). In a deployed build, the copies scripts/build-storybooks.mjs puts under /storybook/.
const href = (id: 'iris' | 'ars' | 'iris-new', port: number) =>
  import.meta.env.DEV ? `http://127.0.0.1:${port}/` : `${import.meta.env.BASE_URL}storybook/${id}/index.html`;

export const STORYBOOKS: StorybookLink[] = [
  {
    id: 'iris',
    name: 'Iris Storybook',
    subtitle: 'Iris UI components',
    description: 'The shared Iris components the shell is built from: buttons, menus, tables, forms and the app chrome.',
    href: href('iris', 6107),
  },
  {
    id: 'ars',
    name: 'ARS Storybook',
    subtitle: 'Active Roles components',
    description: 'The Active Roles components from the ARS - Primary Figma file, built with Iris.',
    href: href('ars', 6106),
  },
  {
    id: 'iris-new',
    name: 'Iris new Storybook',
    subtitle: 'Draft Iris components',
    description: 'Draft components built from the Iris UI Kit: the Advanced filter Bar and Panel.',
    href: href('iris-new', 6108),
  },
];
