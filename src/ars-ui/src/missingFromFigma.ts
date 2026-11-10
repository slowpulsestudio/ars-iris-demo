/** Figma files the kit's components come from. */
export const FIGMA_FILES = {
  primary: { name: 'ARS - Primary', key: 'IlG4nne9VhqpONzqc0tfKg' },
  crud: { name: 'ARS_WebUI2_CRUD', key: 'djs9NKqC3YG6KtAhHiQ4iT' },
} as const;

export type FigmaFileId = keyof typeof FIGMA_FILES;

/** Link to a node in one of the Figma files. */
export function figmaNodeUrl(file: FigmaFileId, nodeId: string): string {
  const { name, key } = FIGMA_FILES[file];
  return `https://www.figma.com/design/${key}/${encodeURIComponent(name)}?node-id=${nodeId.replace(':', '-')}`;
}

export interface MissingFromFigmaEntry {
  /** Kit component folder, e.g. ARSEmpty. */
  component: string;
  /** Layer name in Figma. */
  figmaName: string;
  figmaNodeId: string;
  /** The Figma file the node is in. */
  file: FigmaFileId;
  /** Where the screens use it and what the ARS - Primary kit lacks. */
  note: string;
}

/**
 * Components the ARS_WebUI2_CRUD screens use that are not in the ARS - Primary kit.
 * They are drawn from the CRUD file and shown in Storybook under "Missing from Figma".
 */
export const MISSING_FROM_FIGMA: MissingFromFigmaEntry[] = [
  {
    component: 'ARSEmpty',
    figmaName: 'Empty',
    figmaNodeId: '1369:31209',
    file: 'crud',
    note: 'Main content of Tree view with no directory or folder selected. A symbol in the CRUD file only; ARS_Empty_Content is a different component (header, toolbar and empty state).',
  },
];
