import { TableHeadRow, type TableHeadRowProps } from '../../parts/TableHeadRow/TableHeadRow.js';

/** Figma column set for ARS.Table head_Mixed_obj (3423:28002). */
export const MIXED_OBJECT_COLUMNS: TableHeadRowProps['columns'] = [
  { icon: 'IdentificationCard', label: 'Displayname', width: 180 },
  { icon: 'UserCircleCheck', label: 'Status', width: 220 },
  { icon: 'Tag', label: 'Tags', width: 385.5 },
  { icon: 'BuildingOffice', label: 'Location', width: 385.5 },
];

export type ARSTableHeadMixedObjProps = Omit<TableHeadRowProps, 'columns'>;

/** ARS.Table head_Mixed_obj — column heads for a list of mixed object types. */
export function ARSTableHeadMixedObj(props: ARSTableHeadMixedObjProps) {
  return <TableHeadRow columns={MIXED_OBJECT_COLUMNS} {...props} />;
}
