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
    component: 'ARSDelete',
    figmaName: 'ARS_Delete',
    figmaNodeId: '1755:15058',
    file: 'crud',
    note: 'The delete modal: type the object name to confirm, wait, then the result. Content from ARS_CRUD_Delete (3267:16017) and ARS_CRUD_Delete_Success (3267:16120). ARS - Primary only has ARS_Delete_Confirmation_Modal_Template, which asks for REMOVE.',
  },
  {
    component: 'ARSModalFormUnsaved',
    figmaName: 'ARS_Modal_Form_Unsaved',
    figmaNodeId: '3534:19369',
    file: 'crud',
    note: 'Asks before leaving a form with unsaved changes. Content from ARS_Modal_Form_Unsaved_Content (3534:19266). Figma\'s text says "will be discard".',
  },
];
