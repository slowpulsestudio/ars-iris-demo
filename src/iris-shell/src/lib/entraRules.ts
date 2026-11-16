/**
 * Entra has no location, so nothing in Entra is moved (docs/decided-business-rules.md, ENT-3).
 * Takes Move out of an Object Management panel's action groups when the object is in Entra.
 */
export function withoutMove<T extends { label: string }>(groups: T[][], entra: boolean): T[][] {
  return entra ? groups.map((group) => group.filter((action) => action.label !== 'Move')) : groups;
}
