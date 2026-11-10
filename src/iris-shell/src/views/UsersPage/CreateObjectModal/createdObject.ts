import type { ARSNewObjectValues } from '@ars';
import type { DirectoryObject, DirectoryObjectType } from '../../../lib/directoryData.js';
import { showToast } from '../../../lib/toastStore.js';
import { makeDetails, type User } from '../mockUsers.js';

/** What the New object flow hands back when the user creates the object. */
export interface CreateObjectResult {
  objectType: string;
  values: ARSNewObjectValues;
  /** Directory node the object goes in; `null` for the flat Users list. */
  locationId: string | null;
  /** Readable path of the destination, e.g. "Active Directory / O1D.local / Test OU". */
  locationLabel: string;
}

const TYPE_BY_NAME: Record<string, DirectoryObjectType> = {
  user: 'user',
  'ad user': 'user',
  'entra user': 'user',
  group: 'group',
  computer: 'computer',
  asset: 'computer',
  'organizational unit': 'ou',
  'shared folder': 'container',
  contact: 'contact',
  'group managed service account': 'gmsa',
  'group management service account': 'gmsa',
};

/** "New AD User" and "Add User" both create a "User"; the Bulk entries don't create one object. */
export function objectTypeFromMenuLabel(label: string): string | null {
  if (/^bulk /i.test(label)) return null;
  return label.replace(/^(new|add) /i, '');
}

export function directoryTypeFor(objectType: string): DirectoryObjectType {
  return TYPE_BY_NAME[objectType.toLowerCase()] ?? 'user';
}

/** The name the new object is known by: display name, then name, then the person's name. */
export function newObjectName({ displayName, name, firstName, lastName }: ARSNewObjectValues, objectType: string): string {
  return (
    displayName.trim() ||
    name.trim() ||
    `${firstName} ${lastName}`.trim() ||
    `New ${objectType.toLowerCase()}`
  );
}

let sequence = 0;
const nextId = (prefix: string) => `${prefix}-new-${(sequence += 1)}`;

/** The ARS_New_Object_Toast text; View opens the new object when it has a page. */
export function announceCreated(result: CreateObjectResult, viewHref?: string): void {
  showToast(`${newObjectName(result.values, result.objectType)} successfully created`, {
    supportingText: `${result.objectType} created in ${result.locationLabel}${viewHref ? ' To open it, click View.' : ''}`,
    viewHref,
  });
}

export function userFromValues(result: CreateObjectResult): User {
  const { values } = result;
  const name = newObjectName(values, result.objectType);
  const login = `${values.userLogonName.trim() || name.replace(/\s+/g, '.')}`;
  return {
    id: nextId('user'),
    name,
    status: 'Active',
    description: '',
    email: `${login.toLowerCase().replace(/@.*$/, '')}@acme.io`,
    objectId: crypto.randomUUID(),
    details: {
      ...makeDetails(name, login),
      ...(values.firstName.trim() && { firstName: values.firstName.trim() }),
      ...(values.lastName.trim() && { lastName: values.lastName.trim() }),
      ...(values.initials.trim() && { initials: values.initials.trim() }),
      displayName: values.displayName.trim() || makeDetails(name, login).displayName,
    },
    tags: [],
    location: result.locationLabel,
  };
}

export function directoryObjectFromValues(result: CreateObjectResult, nodeId: string): DirectoryObject {
  const { values } = result;
  const type = directoryTypeFor(result.objectType);
  const name = newObjectName(values, result.objectType);
  return {
    id: nextId(nodeId),
    name,
    type,
    description: '',
    parentId: nodeId,
    isContainer: false,
    details: {
      description: '',
      location: result.locationLabel,
      created: new Date().toISOString().slice(0, 10),
      ...(type === 'user' && {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        displayName: values.displayName.trim(),
        userPrincipalName: `${values.userLogonName.trim()}${values.suffix}`,
        authorizationInfo: '',
      }),
    },
  };
}
