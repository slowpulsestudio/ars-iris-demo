/** A Storybook listed on the Storybooks page (#/storybooks). */
export interface StorybookLink {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  href: string;
}

// Local dev servers; the ports match the `storybook` scripts in src/iris-storybook and src/ars-ui.
export const STORYBOOKS: StorybookLink[] = [
  {
    id: 'iris',
    name: 'Iris Storybook',
    subtitle: 'Iris UI components',
    description: 'The shared Iris components the shell is built from: buttons, menus, tables, forms and the app chrome.',
    href: 'http://127.0.0.1:6107/',
  },
  {
    id: 'ars',
    name: 'ARS Storybook',
    subtitle: 'Active Roles components',
    description: 'The Active Roles components from the ARS - Primary Figma file, built with Iris.',
    href: 'http://127.0.0.1:6106/',
  },
];
