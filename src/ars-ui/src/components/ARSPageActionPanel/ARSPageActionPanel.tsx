import { ActionPanel } from '../../parts/ActionPanel/ActionPanel.js';

export interface ARSPageActionPanelProps {
  /** Called with "Move", "Copy" or "Delete". */
  onAction?: (action: string) => void;
  className?: string;
}

/** ARS_Page_Action panel — Move / Copy and Delete for the object on the page. Figma: 2944:29985. */
export function ARSPageActionPanel(props: ARSPageActionPanelProps) {
  return <ActionPanel {...props} groups={[[{ label: 'Move' }, { label: 'Copy' }], [{ label: 'Delete', danger: true }]]} />;
}
