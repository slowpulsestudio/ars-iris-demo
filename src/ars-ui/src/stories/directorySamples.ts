import type { MultiSelectOption } from '@iris/components/MultiSelect/MultiSelect.js';
import type { TreeNode } from '@iris/components/Tree/Tree.js';

/** ARS_Directory_Multiselect (4596:20589) sample items. */
export const directoryOptions: MultiSelectOption[] = [
  { value: 'ad1', title: 'AD1', subtitle: 'Meta text comes here', icon: 'DiamondsFour' },
  { value: 'ad2', title: 'AD2', subtitle: 'Meta text comes here', icon: 'DiamondsFour' },
  { value: 'entra1', title: 'Entra 1', subtitle: 'Meta text comes here', icon: 'Cloud' },
  { value: 'entra2', title: 'Entra 2', subtitle: 'Meta text comes here', icon: 'Cloud' },
  { value: 'ad3', title: 'AD3', subtitle: 'Meta text comes here', icon: 'DiamondsFour' },
  { value: 'entra3', title: 'Entra 3', subtitle: 'Meta text comes here', icon: 'DiamondsFour' },
];

export const directorySelected = ['ad1', 'ad2', 'entra1', 'entra2'];

/** ARS_Flat_View_Content (3563:17382) items. */
export const flatItems = [
  { id: 'users', label: 'Users', icon: 'Users' },
  { id: 'groups', label: 'Groups', icon: 'UsersThree' },
  { id: 'devices', label: 'Devices', icon: 'Devices' },
  { id: 'agents', label: 'Agents', icon: 'Robot' },
  { id: 'applications', label: 'Applications', icon: 'Browsers' },
  { id: 'access-templates', label: 'Access templates', icon: 'UserCircleCheck' },
  { id: 'managed-units', label: 'Managed units', icon: 'FolderSimpleStar' },
];

const folder = (id: string, label: string, children?: TreeNode[]): TreeNode => ({
  id,
  label,
  icon: 'Folder',
  openIcon: 'FolderOpen',
  children,
});

// Collapsed nodes get a placeholder child so they show a caret.
const collapsed = (id: string) => [folder(`${id}/placeholder`, '…')];

/** The tree used by the ARS_Tree_*_Content variants (3563:17383–17385). */
export const directoryTree: TreeNode[] = [
  { id: 'access-templates', label: 'Access templates', icon: 'UserCircleCheck', children: collapsed('access-templates') },
  { id: 'managed-units', label: 'Managed units', icon: 'FolderSimpleStar', children: collapsed('managed-units') },
  {
    id: 'managed',
    label: 'Managed Directories',
    icon: 'UserCircleCheck',
    separatorBefore: true,
    children: [
      folder('ad', 'Active Directories', [
        folder('o1d', 'O1D.local', [
          folder('builtin', 'Builtin', collapsed('builtin')),
          folder('dg-tests', 'DG-Tests', collapsed('dg-tests')),
          folder('dc', 'Domain Controllers', collapsed('dc')),
          folder('fsp', 'Foreign Security Principals', collapsed('fsp')),
          folder('keys', 'Keys', collapsed('keys')),
          folder('msa', 'Managed Service Accounts', collapsed('msa')),
          folder('program-data', 'Program Data', collapsed('program-data')),
          folder('system', 'System', collapsed('system')),
          folder('test-ou', 'Test OU', [
            folder('test1', 'Test1', collapsed('test1')),
            folder('test2', 'Test2', collapsed('test2')),
          ]),
          folder('ad-lds', 'AD LDS', collapsed('ad-lds')),
        ]),
        folder('o2d', 'O2D.local', collapsed('o2d')),
      ]),
      folder('entra', 'Entra Directories', [
        {
          id: 'tenant',
          label: '3bf67d.onmicrosoft.com',
          icon: 'WindowsLogo',
          children: [
            { id: 'tenant/users', label: 'Users', icon: 'Users', children: [] },
            { id: 'tenant/groups', label: 'Groups', icon: 'UsersThree', children: collapsed('tenant/groups') },
            { id: 'tenant/devices', label: 'Devices', icon: 'Devices', children: collapsed('tenant/devices') },
            { id: 'tenant/agents', label: 'Agents', icon: 'Robot', children: collapsed('tenant/agents') },
            { id: 'tenant/applications', label: 'Applications', icon: 'Browsers', children: collapsed('tenant/applications') },
          ],
        },
      ]),
    ],
  },
];

/** Favorites (3991:36687) sections. */
export const favoriteSections = [
  {
    title: 'Views',
    items: [
      { id: 'my-custom-view', label: 'My Custom View', icon: 'Star' },
      { id: 'users-in-my-ou', label: 'Users in My OU', icon: 'Star' },
    ],
  },
  {
    title: 'Objects',
    items: [
      { id: 'my-ou', label: 'My OU', icon: 'FolderStar' },
      { id: 'operator-computer', label: 'Operator computer', icon: 'Devices' },
      { id: 'peter-kim', label: 'Peter Kim', icon: 'User' },
    ],
  },
];
