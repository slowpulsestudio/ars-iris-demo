import { TableHeadRow, type TableHeadRowProps } from '../../parts/TableHeadRow/TableHeadRow.js';

/** Figma column set for ARS.Table head_single_obj (3423:27419). */
export const SINGLE_OBJECT_COLUMNS: TableHeadRowProps['columns'] = [
  { icon: 'IdentificationCard', label: 'Display Name', width: 180 },
  { icon: 'UserCircleCheck', label: 'Status', width: 86 },
  { icon: 'ArticleNyTimes', label: 'Description', width: 434 },
  { icon: 'Tag', label: 'Tags', width: 231 },
  { icon: 'BuildingOffice', label: 'Location', width: 180 },
];

export type ARSTableHeadSingleObjProps = Omit<TableHeadRowProps, 'columns'>;

/** ARS.Table head_single_obj — column heads for a list of one object type. */
export function ARSTableHeadSingleObj(props: ARSTableHeadSingleObjProps) {
  return <TableHeadRow columns={SINGLE_OBJECT_COLUMNS} {...props} />;
}
