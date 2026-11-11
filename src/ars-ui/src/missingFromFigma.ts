/** Figma files the kit's components come from. */
export const FIGMA_FILES = {
  primary: { name: 'ARS - Primary', key: 'IlG4nne9VhqpONzqc0tfKg' },
  crud: { name: 'ARS_WebUI2_CRUD', key: 'djs9NKqC3YG6KtAhHiQ4iT' },
  move: { name: 'ARS_WebUI2_Move_Browse_Objects', key: 'IXKXZpycHiFcKbvHMvlc9r' },
  groups: { name: 'ARS_WebUI2_Groups', key: 'KukLyO1RkJ4kYTzxGWd2Q7' },
  ou: { name: 'ARS_WebUI2_OU_Management', key: 'DwKW5hhTprayGwhbMtOKMr' },
  managedUnits: { name: 'ARS_WebUI2_Managed-Units', key: 'WsXrW6CBUME9thy8z8hPRR' },
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
  {
    component: 'ARSSelectedObjectsBlock',
    figmaName: 'Selected objects block',
    figmaNodeId: '2224:16697',
    file: 'move',
    note: 'The count and removable Iris Tags of the objects being moved, above the destination tree in the Move Objects side sheet.',
  },
  {
    component: 'ARSMoveToast',
    figmaName: 'Move User toast',
    figmaNodeId: '2396:13581',
    file: 'move',
    note: 'The success toast after a move, with Undo and View. The file draws it three ways: Toast 2355:28099 (several objects), Move User toast 2396:13581 (View object) and Successfully moved toast 2381:23258 (Undo only).',
  },
  {
    component: 'ARSElementDragged',
    figmaName: 'Element-Dragged',
    figmaNodeId: '2281:47208',
    file: 'move',
    note: 'The chip that follows the pointer while an object is dragged from the table to a folder in the directory tree. Variants Directory folder and User.',
  },
  {
    component: 'ARSRenameGroup',
    figmaName: 'Rename Group Modal',
    figmaNodeId: '64:6802',
    file: 'groups',
    note: 'Only a written requirement in Figma: Name and Group name (Pre-windows 2000) fields. No frame, so the layout and button labels are the ARS modal panel with Cancel and Rename.',
  },
  {
    component: 'ARSDeprovisionGroup',
    figmaName: 'Deprovision AD Group',
    figmaNodeId: '64:6805',
    file: 'groups',
    note: 'Only a written requirement in Figma: a Yes or No confirmation, then a toast with Undo. No frame, so the question text is mine.',
  },
  {
    component: 'ARSGroupMembershipButtonSelect',
    figmaName: 'ARS_Group_Membership_Button_Select',
    figmaNodeId: '160:9082',
    file: 'groups',
    note: 'The Members and Members of buttons above a group\'s membership table. In the ARS_WebUI2_Groups file, not in ARS - Primary.',
  },
  {
    component: 'ARSAddMemberModal',
    figmaName: 'Add Member modal',
    figmaNodeId: '215:7485',
    file: 'groups',
    note: 'Find objects, tick the ones to add and Save. The frame is named just "Modal" in Figma; its title is Add Member.',
  },
  {
    component: 'ARSNewOrganizationalUnit',
    figmaName: 'ARS_New_Organizational_Unit',
    figmaNodeId: '1394:14812',
    file: 'ou',
    note: 'The New Organizational Unit modal: Name, Description and protect checkbox beside an explanation. In the ARS_WebUI2_OU_Management file, not in ARS - Primary.',
  },
  {
    component: 'ARSManagedUsersContent',
    figmaName: 'ARS_Managed_Users_Content',
    figmaNodeId: '7058:6179',
    file: 'managedUnits',
    note: 'The Managed Units list: header, search and a Name, Modified, Description and Type table.',
  },
  {
    component: 'ARSManagedUnitMembers',
    figmaName: 'ARS_Managed_Unit_Members',
    figmaNodeId: '7074:6939',
    file: 'managedUnits',
    note: 'A managed unit\'s members: group-style header, search and a Name, Description and Type table (ARS_Managed_Unit_Members_Table 7064:12185).',
  },
];
