import type { VerticalNavEntry } from './verticals.js';
import adminUser from './personas/admin-user.json';
import helpdeskUser from './personas/helpdesk-user.json';
import selfServiceEndUser from './personas/self-service-end-user.json';

/** A navigation entry in a persona file. */
export interface PersonaNavEntry extends VerticalNavEntry {
  /** Page's Figma design isn't final yet (WIP:userview in docs/ars-component-map.md). */
  wip?: boolean;
  /** Figma frame the page is built from (see docs/ars-component-map.md). */
  figmaNode?: string;
}

/** What a persona sees in the Active Roles navigation. */
export interface PersonaNavigation {
  /** Page the persona lands on after being picked on the welcome page. */
  defaultRoute: string;
  /** Show the directory panel (the second left rail). */
  showDirectoryPanel: boolean;
  /**
   * The global navigation starts open. David and Werner start with it closed, as the Figma screens draw it
   * (e.g. ARS_WebUI2_Groups 167:6097); each persona's own choice is remembered once they open or close it.
   */
  globalNavOpen: boolean;
  mainNav: PersonaNavEntry[];
  otherNav: PersonaNavEntry[];
}

/** One persona / scenario. Each lives in its own JSON file in ./personas/. */
export interface Persona {
  id: string;
  name: string;
  email: string;
  /** Photo from the Iris UI Kit Avatar component, served from public/avatars/. */
  avatar: string;
  /** Persona name shown on the welcome-page card. */
  personaTitle: string;
  role: string;
  /** Short scenario shown on the welcome-page card. */
  scenario: string;
  age: number;
  location: string;
  maritalStatus: string;
  bio: string[];
  needsAndExpectations: string[];
  motivations: string[];
  painPoints: string[];
  navigation: PersonaNavigation;
}

/** All personas, in welcome-page order. */
export const PERSONAS: Persona[] = [adminUser, helpdeskUser, selfServiceEndUser];

/** Used wherever a persona is needed before anyone has been picked. */
export const DEFAULT_PERSONA: Persona = PERSONAS[0];

export function findPersona(id: string | null | undefined): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}
