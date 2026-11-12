import { useSyncExternalStore } from 'react';
import type { MultiSelectOption } from '../components/MultiSelect/MultiSelect.js';
import { hash } from './sampleData.js';

/** Directories available in the directory multi-select; every Flat view list is split between them. */
export const DIRECTORIES: MultiSelectOption[] = [
  { value: 'entra-1', title: 'Entra 1', subtitle: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890', icon: 'WindowsLogo' },
  { value: 'entra-2', title: 'Entra 2', subtitle: 'B2C3D4E5-F6A7-8901-BCDE-F23456789012', icon: 'WindowsLogo' },
  { value: 'ad-1', title: 'AD-1', subtitle: 'C3D4E5F6-A7B8-9012-CDEF-345678901234', icon: 'HardDrives' },
  { value: 'ad-2', title: 'AD-2', subtitle: 'D4E5F6A7-B8C9-0123-DEF0-456789012345', icon: 'HardDrives' },
  { value: 'entra-3', title: 'Entra 3', subtitle: 'E5F6A7B8-C9D0-1234-EF01-567890123456', icon: 'WindowsLogo' },
  { value: 'ad-3', title: 'AD-3', subtitle: 'F6A7B8C9-D0E1-2345-F012-678901234567', icon: 'HardDrives' },
  { value: 'ad-4', title: 'AD-4', subtitle: 'A7B8C9D0-E1F2-3456-0123-789012345678', icon: 'HardDrives' },
  { value: 'entra-4', title: 'Entra 4', subtitle: 'B8C9D0E1-F2A3-4567-1234-890123456789', icon: 'WindowsLogo' },
  { value: 'ad-5', title: 'AD-5', subtitle: 'C9D0E1F2-A3B4-5678-2345-901234567890', icon: 'HardDrives' },
];

/** Which kind of directory an item can sit in: Entra ones in an Entra directory, AD ones in an AD directory, others in any. */
export type DirectoryKind = 'entra' | 'ad' | 'any';

const ALL = new Set(DIRECTORIES.map((d) => d.value));
let selected: Set<string> = new Set(ALL);
const listeners = new Set<() => void>();

function setSelected(next: Set<string>) {
  selected = new Set(next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The directories ticked in the Flat view's directory filter, shared by the panel and the lists. */
export function useDirectoryFilter(): [Set<string>, (next: Set<string>) => void] {
  return [useSyncExternalStore(subscribe, () => selected), setSelected];
}

/** The directory an item is in: fixed for a given id, but spread across the directories. */
export function bucketFor(id: string, kind: DirectoryKind = 'any'): string {
  const pool = DIRECTORIES.filter((d) => kind === 'any' || d.value.startsWith(`${kind}-`));
  return pool[hash(id) % pool.length].value;
}

/** The directory for the nth item of a short list, so every directory gets some (4 is coprime with 9, so the order looks scattered). */
export function bucketAt(index: number): string {
  return DIRECTORIES[(index * 4) % DIRECTORIES.length].value;
}

/** Whether the filter lets this item through. Nothing ticked reads as "All directories", so it lets everything through. */
export function inDirectories(selectedDirs: Set<string>, id: string, kind: DirectoryKind = 'any'): boolean {
  return selectedDirs.size === 0 || selectedDirs.has(bucketFor(id, kind));
}
