/**
 * directoryData — mock directory objects for the Tree view.
 *
 * Kept deliberately **separate** from the flat Users mock (`mockUsers.ts` /
 * `usersStore.tsx`) so the existing Users pages are untouched. A node's leaf
 * contents are generated **deterministically** from a seed derived from the
 * node id, so ids/names stay stable across navigations, reloads, deep-links,
 * and the detail prev/next pager — without shipping a giant static array.
 */

export type DirectoryObjectType =
  | 'ou'
  | 'container'
  | 'user'
  | 'computer'
  | 'group'
  | 'contact'
  | 'gmsa';

export interface DirectoryObjectDetails {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  /** User objects: the initials shown on the edit form. */
  initials?: string;
  userPrincipalName?: string;
  authorizationInfo?: string;
  description: string;
  created?: string;
  memberCount?: number;
  location?: string;
}

export interface DirectoryObject {
  id: string;
  name: string;
  type: DirectoryObjectType;
  description: string;
  /** The containing node's id. */
  parentId: string;
  /** Container rows drill in (they are themselves tree nodes); leaves open detail. */
  isContainer: boolean;
  details: DirectoryObjectDetails;
}

/** Presentation metadata per object type (label + shared-manifest icon). */
export const OBJECT_TYPE_META: Record<DirectoryObjectType, { label: string; icon: string }> = {
  ou: { label: 'Organizational Unit', icon: 'Folder' },
  container: { label: 'Container', icon: 'Folder' },
  user: { label: 'User', icon: 'User' },
  computer: { label: 'Computer', icon: 'Devices' },
  group: { label: 'Group', icon: 'UsersThree' },
  contact: { label: 'Contact', icon: 'AddressBook' },
  gmsa: { label: 'Group Management Service Account', icon: 'UserCircle' },
};

/* ------------------------------------------------------------------ */
/*  Static node tree (mirrors the Figma / screenshots)                */
/* ------------------------------------------------------------------ */

interface RawNode {
  id: string;
  name: string;
  type: 'ou' | 'container';
  description: string;
  icon?: string;
  /** How many leaf objects to synthesize for this node's listing. */
  leafCount?: number;
  children?: RawNode[];
}

/** The Entra tenants, in the order of the panel's directories Entra 1 to 4 (the first is Figma's). */
export const ENTRA_TENANTS = [
  { id: 'entra-3bf67d', name: '3bf67d.onmicrosoft.com', description: 'Primary Entra tenant.', leafCount: 128 },
  { id: 'entra-c82a1f', name: 'c82a1f.onmicrosoft.com', description: 'Subsidiary Entra tenant.', leafCount: 110 },
  { id: 'entra-7de094', name: '7de094.onmicrosoft.com', description: 'Partner Entra tenant.', leafCount: 96 },
  { id: 'entra-51b3a8', name: '51b3a8.onmicrosoft.com', description: 'Development Entra tenant.', leafCount: 84 },
];

const TREE: RawNode[] = [
  { id: 'access-templates', name: 'Access templates', type: 'container', description: 'Reusable access-control templates.', icon: 'UserCircleCheck', leafCount: 24 },
  { id: 'managed-units', name: 'Managed units', type: 'container', description: 'Delegated administrative units.', icon: 'FolderStar', leafCount: 18 },
  {
    id: 'managed-directories',
    name: 'Managed directories',
    type: 'container',
    description: 'Directories under management.',
    icon: 'UserCircleCheck',
    children: [
      {
        id: 'active-directories',
        name: 'Active Directory',
        type: 'container',
        description: 'On-premises Active Directory forests.',
        children: [
          {
            id: 'o1d-local',
            name: 'O1D.local',
            type: 'container',
            description: 'Primary AD forest.',
            icon: 'SquaresFour',
            children: [
              { id: 'o1d-builtin', name: 'Builtin', type: 'ou', description: 'Built-in security principals.', leafCount: 32 },
              { id: 'o1d-dg-tests', name: 'DG-Tests', type: 'ou', description: 'Delegation test objects.', leafCount: 46 },
              { id: 'o1d-domain-controllers', name: 'Domain Controllers', type: 'ou', description: 'Domain controller computers.', leafCount: 12 },
              { id: 'o1d-foreign-security', name: 'Foreign Security Principals', type: 'ou', description: 'Cross-forest principals.', leafCount: 8 },
              { id: 'o1d-keys', name: 'Keys', type: 'ou', description: 'Key credential objects.', leafCount: 15 },
              { id: 'o1d-managed-service-accounts', name: 'Managed Service Accounts', type: 'ou', description: 'gMSA accounts.', leafCount: 21 },
              { id: 'o1d-program-data', name: 'Program Data', type: 'ou', description: 'Application-created objects.', leafCount: 63 },
              { id: 'o1d-system', name: 'System', type: 'ou', description: 'System containers.', leafCount: 40 },
              {
                id: 'o1d-test-ou',
                name: 'Test OU',
                type: 'ou',
                description: 'Sandbox organizational unit.',
                leafCount: 2308,
                children: [
                  { id: 'o1d-test-ou-test1', name: 'Test1', type: 'ou', description: 'TestOU 1', leafCount: 34 },
                  { id: 'o1d-test-ou-test2', name: 'Test2', type: 'ou', description: 'TestOU 2', leafCount: 27 },
                ],
              },
              { id: 'o1d-ad-lds', name: 'AD LDS', type: 'ou', description: 'Lightweight directory partitions.', leafCount: 19 },
            ],
          },
          { id: 'o2d-local', name: 'O2D.local', type: 'container', description: 'Secondary AD forest.', icon: 'SquaresFour', leafCount: 54 },
          { id: 'o3d-local', name: 'O3D.local', type: 'container', description: 'Regional AD forest.', icon: 'SquaresFour', leafCount: 62 },
          { id: 'o4d-local', name: 'O4D.local', type: 'container', description: 'Acquired company AD forest.', icon: 'SquaresFour', leafCount: 48 },
          { id: 'o5d-local', name: 'O5D.local', type: 'container', description: 'Lab and testing AD forest.', icon: 'SquaresFour', leafCount: 70 },
        ],
      },
      {
        id: 'entra-directories',
        name: 'Entra ID',
        type: 'container',
        description: 'Microsoft Entra ID tenants.',
        children: ENTRA_TENANTS.map((t, i) => ({
          id: t.id,
          name: t.name,
          type: 'container' as const,
          description: i === 0 ? 'Primary Entra tenant.' : t.description,
          icon: 'SquaresFour',
          leafCount: t.leafCount,
        })),
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Indexes (built once)                                              */
/* ------------------------------------------------------------------ */

const nodeById = new Map<string, RawNode>();
const parentIdByNode = new Map<string, string | null>();

function indexTree(nodes: RawNode[], parentId: string | null): void {
  for (const n of nodes) {
    nodeById.set(n.id, n);
    parentIdByNode.set(n.id, parentId);
    if (n.children) indexTree(n.children, n.id);
  }
}
indexTree(TREE, null);

/** Rebuild the id/parent indexes + derived views after a structural change. */
function reindex(): void {
  nodeById.clear();
  parentIdByNode.clear();
  indexTree(TREE, null);
  NODE_TREE = TREE.map(toNodeView);
  ALL_NODE_IDS = computeAllNodeIds();
}

export interface DirectoryNodeView {
  id: string;
  name: string;
  icon?: string;
  hasChildren: boolean;
  children: DirectoryNodeView[];
}

function toNodeView(n: RawNode): DirectoryNodeView {
  return {
    id: n.id,
    name: n.name,
    icon: n.icon,
    hasChildren: !!(n.children && n.children.length),
    children: (n.children ?? []).map(toNodeView),
  };
}

/** The node tree shaped for rendering the sidebar `Tree`. */
export let NODE_TREE: DirectoryNodeView[] = TREE.map(toNodeView);

/** The first (top-of-tree) node — the default selection for the Tree view. */
export const FIRST_NODE_ID: string = NODE_TREE[0].id;

function computeAllNodeIds(): string[] {
  const ids: string[] = [];
  const walk = (nodes: DirectoryNodeView[]): void => {
    for (const n of nodes) {
      ids.push(n.id);
      if (n.children.length) walk(n.children);
    }
  };
  walk(NODE_TREE);
  return ids;
}

/** Every container node id, depth-first — used to fully unfurl the tree. */
export let ALL_NODE_IDS: string[] = computeAllNodeIds();

/* ------------------------------------------------------------------ */
/*  Mutations (drag-and-drop reparenting) + change subscription       */
/* ------------------------------------------------------------------ */

let treeVersion = 0;
const listeners = new Set<() => void>();

/** Subscribe to structural tree changes (for `useSyncExternalStore`). */
export function subscribeDirectory(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Monotonic version bumped on every structural change. */
export function getTreeVersion(): number {
  return treeVersion;
}

/** True when `candidateId` is `ancestorId` or nested somewhere beneath it. */
function isSelfOrDescendant(candidateId: string, ancestorId: string): boolean {
  if (candidateId === ancestorId) return true;
  let cur: string | null | undefined = parentIdByNode.get(candidateId) ?? null;
  while (cur) {
    if (cur === ancestorId) return true;
    cur = parentIdByNode.get(cur) ?? null;
  }
  return false;
}

/**
 * Whether `nodeId` may be reparented under `newParentId` (`null` = top level).
 * Rejects no-ops and moving a node into itself or one of its descendants.
 */
export function canMoveNode(nodeId: string, newParentId: string | null): boolean {
  if (!nodeById.has(nodeId)) return false;
  if (newParentId !== null && !nodeById.has(newParentId)) return false;
  if (newParentId !== null && isSelfOrDescendant(newParentId, nodeId)) return false;
  const currentParentId = parentIdByNode.get(nodeId) ?? null;
  return currentParentId !== newParentId;
}

/**
 * Reparent `nodeId` under `newParentId` (`null` = top level). Returns whether
 * the move happened. Mutates the raw tree in place, reindexes, and notifies
 * subscribers so the sidebar re-renders.
 */
export function moveNode(nodeId: string, newParentId: string | null): boolean {
  if (!canMoveNode(nodeId, newParentId)) return false;
  const node = nodeById.get(nodeId)!;
  const currentParentId = parentIdByNode.get(nodeId) ?? null;

  const oldSiblings = currentParentId ? (nodeById.get(currentParentId)!.children ?? []) : TREE;
  const idx = oldSiblings.findIndex((n) => n.id === nodeId);
  if (idx === -1) return false;
  oldSiblings.splice(idx, 1);

  if (newParentId) {
    const parent = nodeById.get(newParentId)!;
    (parent.children ??= []).push(node);
  } else {
    TREE.push(node);
  }

  reindex();
  treeVersion += 1;
  listeners.forEach((l) => l());
  return true;
}

export function getNode(nodeId: string): RawNode | undefined {
  return nodeById.get(nodeId);
}

/** Tile icon for a node (its own icon, else a folder). */
export function getNodeIcon(nodeId: string): string {
  return nodeById.get(nodeId)?.icon ?? 'Folder';
}

export function isContainerNode(nodeId: string): boolean {
  return nodeById.has(nodeId);
}

/** Ancestor chain (root → node), used for breadcrumbs + tree auto-expand. */
export function getNodePath(nodeId: string): RawNode[] {
  const path: RawNode[] = [];
  let cur: string | null | undefined = nodeId;
  while (cur) {
    const n = nodeById.get(cur);
    if (!n) break;
    path.unshift(n);
    cur = parentIdByNode.get(cur) ?? null;
  }
  return path;
}

/* ------------------------------------------------------------------ */
/*  Deterministic leaf generation                                     */
/* ------------------------------------------------------------------ */

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — tiny deterministic PRNG. */
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  'Peter', 'Elena', 'Clara', 'Nadia', 'Oliver', 'Aron', 'Natalie', 'Markus', 'Sofia', 'Owen',
  'Amelia', 'Benjamin', 'Charlotte', 'James', 'Evelyn', 'Henry', 'Abigail', 'Alexander', 'Emily',
  'Sebastian', 'Jack', 'Avery', 'Daniel', 'Ella', 'Matthew', 'Scarlett', 'Grace', 'Chloe', 'David',
  'Victoria', 'Carter', 'Riley', 'Julian', 'Lily', 'Leo', 'Zoe', 'Nora', 'Dylan', 'Hazel', 'Layla',
];
const LAST_NAMES = [
  'Kim', 'Vasquez', 'Webb', 'Patel', 'Tanaka', 'Estevez', 'Hughes', 'Coleman', 'Jenkins', 'Perry',
  'Powell', 'Long', 'Patterson', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales',
  'Bryant', 'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Wallace',
];
const DESCRIPTIONS = [
  'Oversees platform administration.',
  'UI/motion designer specializing in micro-interactions and design systems at scale.',
  'Trial user who signed up via referral. Has not logged in for over 60 days.',
  'Account suspended following repeated policy violations. Access revoked on Apr 2025.',
  'Leads platform engineering, oversees infra and security compliance across all regions.',
  'Manages CI/CD pipelines and cloud cost optimization. AWS certified architect.',
];
const LEAF_TYPES: DirectoryObjectType[] = [
  'user', 'user', 'user', 'user', 'computer', 'computer', 'group', 'contact',
];

const pick = <T,>(rng: () => number, arr: T[]): T => arr[Math.floor(rng() * arr.length)];

/**
 * Sample content that doesn't repeat: a spread-out pick by position, with no
 * random draw, so the rest of a folder's objects are unchanged. A step that
 * shares no factor with the list length visits every entry before repeating.
 */
const pickAt = <T,>(arr: T[], node: RawNode, index: number, step: number): T =>
  arr[(hashSeed(node.id) + index * step) % arr.length];

/** Groups are a department and a role: 24 x 12 = 288 different names. */
const DEPARTMENTS: { name: string; thing: string }[] = [
  { name: 'Finance', thing: 'finance and expense' },
  { name: 'Marketing', thing: 'campaign and brand' },
  { name: 'Legal', thing: 'contract and legal' },
  { name: 'HR', thing: 'people and hiring' },
  { name: 'Sales', thing: 'sales and pricing' },
  { name: 'Support', thing: 'customer support' },
  { name: 'Engineering', thing: 'engineering and release' },
  { name: 'Security', thing: 'security and access' },
  { name: 'Operations', thing: 'day-to-day operations' },
  { name: 'IT', thing: 'IT and device' },
  { name: 'Data', thing: 'data and reporting' },
  { name: 'Procurement', thing: 'purchasing and supplier' },
  { name: 'Product', thing: 'product and roadmap' },
  { name: 'Design', thing: 'design and brand' },
  { name: 'Compliance', thing: 'compliance and policy' },
  { name: 'Analytics', thing: 'analytics and insight' },
  { name: 'Facilities', thing: 'buildings and facilities' },
  { name: 'Training', thing: 'learning and training' },
  { name: 'Payroll', thing: 'payroll and benefits' },
  { name: 'Research', thing: 'research and development' },
  { name: 'Network', thing: 'network and connectivity' },
  { name: 'Cloud', thing: 'cloud and hosting' },
  { name: 'Quality', thing: 'quality and testing' },
  { name: 'Executive', thing: 'leadership and board' },
];
const GROUP_ROLES: { name: string; describe: (thing: string) => string }[] = [
  { name: 'Admins', describe: (t) => `Administer ${t} systems.` },
  { name: 'Approvers', describe: (t) => `Approve ${t} requests.` },
  { name: 'Readers', describe: (t) => `Read-only access to ${t} records.` },
  { name: 'Owners', describe: (t) => `Own and manage ${t} resources.` },
  { name: 'Reviewers', describe: (t) => `Review ${t} changes before they go live.` },
  { name: 'Leads', describe: (t) => `Lead the ${t} teams.` },
  { name: 'Operators', describe: (t) => `Run ${t} work day to day.` },
  { name: 'Contributors', describe: (t) => `Contribute to ${t} work.` },
  { name: 'Auditors', describe: (t) => `Audit ${t} activity.` },
  { name: 'Requesters', describe: (t) => `Raise ${t} requests on behalf of their teams.` },
  { name: 'Managers', describe: (t) => `Manage ${t} staff and their access.` },
  { name: 'Users', describe: (t) => `Everyone who uses the ${t} tools.` },
];
const GROUP_STEP = 37;
export const DEPARTMENT_NAMES = new Set(DEPARTMENTS.map((d) => d.name));

const SITES = ['LON', 'NYC', 'BER', 'SYD', 'TOK', 'PAR', 'AMS', 'DUB', 'SIN', 'TOR'];
const DEVICE_KINDS = [
  { code: 'WS', label: 'Workstation' },
  { code: 'LT', label: 'Laptop' },
  { code: 'SRV', label: 'Server' },
  { code: 'VDI', label: 'Virtual desktop' },
];

const USER_DESCRIPTIONS = [
  'Oversees platform administration.',
  'UI/motion designer specializing in micro-interactions and design systems at scale.',
  'Leads platform engineering, oversees infra and security compliance across all regions.',
  'Manages CI/CD pipelines and cloud cost optimization. AWS certified architect.',
  'Senior backend engineer, owns the API gateway and database performance.',
  'Account manager handling enterprise onboarding and renewals.',
  'Runs the service desk and trains new support staff.',
  'Product manager for the self-service portal.',
  'Security analyst, triages alerts and leads incident reviews.',
  'Finance partner for the engineering budget.',
  'Network engineer responsible for the EMEA sites.',
  'Data analyst building the weekly access reports.',
  'HR business partner for the sales organisation.',
  'QA lead for the identity and access releases.',
  'Compliance officer preparing the annual audit evidence.',
  'Cloud architect designing the new landing zones.',
  'Procurement specialist for software licences.',
  'Technical writer for the admin documentation.',
  'Desktop support, owns device builds and imaging.',
  'Release manager, signs off production changes.',
  'Legal counsel for data protection requests.',
  'Marketing lead for the product launch.',
  'Customer success manager for the largest accounts.',
  'Facilities coordinator for the London office.',
  'Training coordinator for the onboarding programme.',
  'Research scientist working on access analytics.',
  'Systems administrator, patches and monitors the servers.',
  'Executive assistant to the CTO.',
  'Contractor supporting the directory migration until June.',
  'Intern on the identity team, shadows the service desk.',
];
const COMPANIES = [
  'Northwind Traders', 'Contoso Logistics', 'Fabrikam Consulting', 'Adventure Works', 'Tailspin Toys',
  'Litware', 'Proseware', 'Wide World Importers', 'Alpine Ski House', 'Coho Winery',
];
const DEVICE_DESCRIPTIONS = [
  (who: string, label: string) => `${label} assigned to ${who}.`,
  (who: string, label: string) => `${label} issued to ${who} for daily work.`,
  (who: string, label: string) => `${label} managed for ${who}'s team.`,
  (who: string, label: string) => `${label} in use by ${who}, last patched this month.`,
];

function makeLeaf(node: RawNode, index: number, rng: () => number, path: string): DirectoryObject {
  const type = pick(rng, LEAF_TYPES);
  // The random draws below are kept as they were, so the names of the rest of
  // a folder's objects (Julian Long and so on) stay the same.
  pick(rng, DESCRIPTIONS);
  const id = `${node.id}-o${index}`;

  if (type === 'computer') {
    const num = 100 + Math.floor(rng() * 900);
    const kind = pick(rng, DEVICE_KINDS);
    const name = `${pickAt(SITES, node, index, 3)}-${kind.code}-${num}`;
    const who = `${pickAt(FIRST_NAMES, node, index, 7)} ${pickAt(LAST_NAMES, node, index, 11)}`;
    const description = pickAt(DEVICE_DESCRIPTIONS, node, index, 1)(who, kind.label);
    return {
      id, name, type, description, parentId: node.id, isContainer: false,
      details: { description, location: path, created: '2024-11-02' },
    };
  }
  if (type === 'group') {
    // The draws are kept so the folder's other objects don't change.
    pick(rng, ['Security', 'Access', 'Admin', 'Ops', 'Finance']);
    pick(rng, ['Users', 'Admins', 'Readers', 'Owners']);
    const memberCount = 1 + Math.floor(rng() * 40);
    // The group the notes and links rely on (Figma's sample, "Security Users") keeps its name, and the 47
    // members Figma's Overview gives it (ARS_Group_Overview 158:33626).
    const pinned = id === 'o1d-builtin-o23';
    const slot = (hashSeed(node.id) + index * GROUP_STEP) % (DEPARTMENTS.length * GROUP_ROLES.length);
    const department = pinned ? DEPARTMENTS.find((d) => d.name === 'Security')! : DEPARTMENTS[slot % DEPARTMENTS.length];
    const role = pinned ? GROUP_ROLES.find((r) => r.name === 'Users')! : GROUP_ROLES[Math.floor(slot / DEPARTMENTS.length)];
    const name = `${department.name} ${role.name}`;
    const description = role.describe(department.thing);
    return {
      id, name, type, description, parentId: node.id, isContainer: false,
      details: { description, location: path, memberCount: pinned ? 47 : memberCount, created: '2024-08-14' },
    };
  }
  const description =
    type === 'contact'
      ? `External contact at ${pickAt(COMPANIES, node, index, 3)}.`
      : pickAt(USER_DESCRIPTIONS, node, index, 7);
  // user / contact
  const firstName = pick(rng, FIRST_NAMES);
  const lastName = pick(rng, LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const initialsName = `${firstName[0]}${lastName}`;
  const domain = path.split(' / ').slice(-2)[0]?.replace(/\s+/g, '') ?? 'O1D.Local';
  return {
    id,
    name,
    type,
    description,
    parentId: node.id,
    isContainer: false,
    details: {
      firstName,
      lastName,
      displayName: initialsName,
      userPrincipalName: `${initialsName}@${domain}`,
      authorizationInfo: '',
      description,
      location: path,
      created: '2025-01-09',
    },
  };
}

const leafCache = new Map<string, DirectoryObject[]>();

function getLeaves(node: RawNode): DirectoryObject[] {
  const cached = leafCache.get(node.id);
  if (cached) return cached;
  const count = node.leafCount ?? 0;
  const rng = makeRng(hashSeed(node.id));
  const path = getNodePath(node.id).map((n) => n.name).join(' / ');
  const leaves: DirectoryObject[] = [];
  for (let i = 0; i < count; i += 1) leaves.push(makeLeaf(node, i, rng, path));
  leafCache.set(node.id, leaves);
  return leaves;
}

/** Convert a child node into a container `DirectoryObject` (a drill-in row). */
function nodeAsObject(n: RawNode): DirectoryObject {
  return {
    id: n.id,
    name: n.name,
    type: n.type,
    description: n.description,
    parentId: parentIdByNode.get(n.id) ?? '',
    isContainer: true,
    details: { description: n.description, location: getNodePath(n.id).map((p) => p.name).join(' / ') },
  };
}

/**
 * Contents of a node: child containers (navigable rows) followed by the
 * synthesized leaf objects. Stable across calls (memoized generation).
 */
export function getChildren(nodeId: string): DirectoryObject[] {
  const node = nodeById.get(nodeId);
  if (!node) return [];
  const containers = (node.children ?? []).map(nodeAsObject);
  return [...containers, ...getLeaves(node)];
}

/** Leaf objects only — the set the detail prev/next pager iterates. */
export function getLeafObjects(nodeId: string): DirectoryObject[] {
  const node = nodeById.get(nodeId);
  return node ? getLeaves(node) : [];
}

export function getObject(nodeId: string, objectId: string): DirectoryObject | undefined {
  return getChildren(nodeId).find((o) => o.id === objectId);
}

/** Put a newly created object at the top of a node's listing and notify subscribers. */
export function addObject(nodeId: string, object: DirectoryObject): boolean {
  const node = nodeById.get(nodeId);
  if (!node) return false;
  getLeaves(node).unshift(object);
  treeVersion += 1;
  listeners.forEach((l) => l());
  return true;
}

/** Replace a leaf object with an edited copy and notify subscribers. */
export function updateObject(nodeId: string, objectId: string, next: DirectoryObject): boolean {
  const node = nodeById.get(nodeId);
  if (!node) return false;
  const child = node.children?.find((c) => c.id === objectId);
  if (child) {
    child.name = next.name;
    child.description = next.description;
    // The sidebar and folder pickers read NODE_TREE, so a renamed folder needs it rebuilt.
    reindex();
    treeVersion += 1;
    listeners.forEach((l) => l());
    return true;
  }
  const leaves = getLeaves(node);
  const i = leaves.findIndex((o) => o.id === objectId);
  if (i < 0) return false;
  leaves[i] = next;
  treeVersion += 1;
  listeners.forEach((l) => l());
  return true;
}

/** Remove a deleted leaf object and notify subscribers. */
export function removeObject(nodeId: string, objectId: string): boolean {
  const node = nodeById.get(nodeId);
  if (!node) return false;
  const leaves = getLeaves(node);
  const i = leaves.findIndex((o) => o.id === objectId);
  if (i < 0) return false;
  leaves.splice(i, 1);
  treeVersion += 1;
  listeners.forEach((l) => l());
  return true;
}

/**
 * Move a leaf object into another node. Returns its former index (so an undo
 * can put it back in place), or null when nothing moved.
 */
export function moveObject(fromNodeId: string, objectId: string, toNodeId: string, toIndex = 0): number | null {
  const from = nodeById.get(fromNodeId);
  const to = nodeById.get(toNodeId);
  if (!from || !to || fromNodeId === toNodeId) return null;
  const source = getLeaves(from);
  const i = source.findIndex((o) => o.id === objectId);
  if (i < 0) return null;
  const [object] = source.splice(i, 1);
  const location = getNodePath(toNodeId).map((n) => n.name).join(' / ');
  getLeaves(to).splice(toIndex, 0, {
    ...object,
    parentId: toNodeId,
    details: { ...object.details, location },
  });
  treeVersion += 1;
  listeners.forEach((l) => l());
  return i;
}

/** The node a container object sits in (`null` = top level). */
export function getParentId(nodeId: string): string | null {
  return parentIdByNode.get(nodeId) ?? null;
}

let createdNodes = 0;

/** Adds an OU under `parentId` and returns its id (`null` when the parent is unknown). */
export function addContainerNode(parentId: string, name: string, description: string): string | null {
  const parent = nodeById.get(parentId);
  if (!parent) return null;
  createdNodes += 1;
  const id = `ou-new-${createdNodes}`;
  (parent.children ??= []).push({ id, name, type: 'ou', description, leafCount: 0 });
  reindex();
  treeVersion += 1;
  listeners.forEach((l) => l());
  return id;
}

/** Removes a container node (and what is under it); returns whether it was there. */
export function removeNode(nodeId: string): boolean {
  const parentId = parentIdByNode.get(nodeId);
  if (parentId === undefined) return false;
  const siblings = parentId ? (nodeById.get(parentId)!.children ?? []) : TREE;
  const i = siblings.findIndex((n) => n.id === nodeId);
  if (i < 0) return false;
  siblings.splice(i, 1);
  reindex();
  treeVersion += 1;
  listeners.forEach((l) => l());
  return true;
}
