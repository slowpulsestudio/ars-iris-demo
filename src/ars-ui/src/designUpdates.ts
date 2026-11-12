import type { FigmaFileId } from './missingFromFigma.js';

export interface DesignUpdateEntry {
  /** What was changed, in a few words. */
  title: string;
  /** The Figma frame it departs from, or none when Figma draws nothing for it. */
  file?: FigmaFileId;
  figmaNodeId?: string;
  /** What Figma draws and what the prototype does instead. */
  note: string;
  /** What to draw or decide in Figma so the design matches. */
  recommendation: string;
  /** Where to see it in the prototype (a `#/…` address; the page adds the persona). */
  prototype: string;
}

/**
 * Design update recommendations: things the prototype does beyond Figma, or builds with no Figma frame
 * (a behaviour, a layout, a placeholder). Components that are wholly missing from the kit are in
 * MISSING_FROM_FIGMA. Each is also an item in docs/review-notes.md.
 */
export const DESIGN_UPDATES: DesignUpdateEntry[] = [
  {
    title: 'Overview count tiles open their tab',
    file: 'primary',
    figmaNodeId: '3353:38318',
    note: 'Figma draws the Group memberships and Assigned roles tiles as plain numbers, with no hover variant (Iris has no card hover either). In the prototype the whole tile is a button: the number is blue, the card shows a hover state built from Iris tokens (strong border, mid shadow, link-hover colour), and it opens the Memberships or Roles tab. Long tile text is cut off with an ellipsis, not wrapped.',
    recommendation: 'Draw the clickable tile with a hover and focus state, and a blue number.',
    prototype: '#/users/isabella-clark',
  },
  {
    title: 'Photos on the Overview avatar',
    file: 'primary',
    figmaNodeId: '3353:38318',
    note: 'Figma draws initials. About six in ten sample users show a portrait instead; the rest keep initials.',
    recommendation: 'Draw the avatar with a photo and with initials, and say which applies when.',
    prototype: '#/users/isabella-clark',
  },
  {
    title: 'Totals in the tab names',
    file: 'primary',
    figmaNodeId: '3598:46761',
    note: 'Figma draws "Memberships (8)" with a sample number and "Roles" with none. The prototype counts the real rows, so the tab, the Overview tile and the list agree, and "Roles" gets a count too.',
    recommendation: 'Show a count on Roles as well, and note that the count equals the list total.',
    prototype: '#/users/isabella-clark',
  },
  {
    title: 'Memberships tab for users',
    file: 'groups',
    figmaNodeId: '167:7662',
    note: 'Figma draws the Members Of page for a group. The same layout lists the groups a user belongs to, without the All / Members / Members Of switch.',
    recommendation: 'Draw the user version of the page (no switch), and the notes\' extra buttons (Remove, Temporary access, Set primary group) if wanted.',
    prototype: '#/users/isabella-clark?tab=memberships',
  },
  {
    title: 'Roles tab for users',
    file: 'groups',
    figmaNodeId: '64:6809',
    note: 'Figma only has a note titled "Roles/Access Templates NEW", no frame. The layout is the Memberships tab\'s with Object Type "Role", and it is not a Figma design.',
    recommendation: 'Draw the Roles tab, or confirm that reusing the Memberships layout is right.',
    prototype: '#/users/isabella-clark?tab=roles',
  },
  {
    title: 'Coming soon placeholder',
    note: 'Not in Figma. One placeholder for every tab and page that is not built: the interactive vault from the Iris EmptyFigure with "Coming soon".',
    recommendation: 'Add the placeholder to the kit so every unbuilt screen is drawn the same way.',
    prototype: '#/users/isabella-clark?tab=connections',
  },
  {
    title: 'Coming soon dialogs for Deprovision, Deactivate and Add User',
    file: 'primary',
    figmaNodeId: '2275:90709',
    note: 'Figma draws the row menu and the New User menu but no screen behind Deprovision, Deactivate or Add User on the Users list. Each opens a dialog with the vault and "Coming soon".',
    recommendation: 'Draw the confirmation for Deprovision and Deactivate, and the Add User screen.',
    prototype: '#/users?dialog=deactivate&target=liam-bennett',
  },
  {
    title: 'Coming soon dialogs for creating a group',
    file: 'groups',
    figmaNodeId: '2111:11197',
    note: 'Figma has only written notes for New AD Group and New Entra Distribution Group, no frames. The Groups list\'s Create button and the Tree view\'s New Group items open a dialog with the vault and "Coming soon".',
    recommendation: 'Draw the New AD Group steps and the New Entra Distribution Group modal.',
    prototype: '#/groups?dialog=new-group',
  },
  {
    title: 'Advanced filter Panel on the lists, Bar in the Add Member modal',
    file: 'primary',
    figmaNodeId: '2613:23294',
    note: 'The Advanced Search file draws the Panel docked beside a list (4090:114583) and a count badge on the Filters button, and the Iris UI Kit draws the Panel (9956:7605) and the Bar (9722:13727). It does not draw the lists other than Users, the Bar in the Add Member modal, or the Favorites filter. The prototype puts the Panel on every list with a Filters button, the Bar in the Add Member modal, the manager and owner pickers and Favourites. The Panel shows one "Common" group of fields where Figma has Common, User, Computer and Groups; the query syntax view shows the sample LDAP from Figma and does not follow the filter, and the "Read the filters guide" link is not wired. Favourites follows ARS - Favorites (4145:13627) with the Bar drawn as ARS filter tags, but lists favourited objects, not the contents of a favourited folder, and has no date-between pill.',
    recommendation: 'Draw the Panel for the Groups, Managed units, Members, Memberships and Roles lists, the Bar in the Add Member modal and on the Favourites list.',
    prototype: '#/users?filter=Tags~Security|Helpdesk;Location~Entra',
  },
  {
    title: 'Working directory filter',
    file: 'crud',
    figmaNodeId: '1372:37388',
    note: 'Figma draws the "All directories (9 selected)" picker but not what it does. It now filters Users, Groups and Management units by their Location or Directory column; ticking none shows none, the button reads "No directories" and the list shows the Lockers empty figure with "No directories selected."',
    recommendation: 'Draw the filtered list, the "none ticked" state and the empty table.',
    prototype: '#/users',
  },
  {
    title: 'Action bar: Move left out for Entra users',
    file: 'primary',
    figmaNodeId: '2385:59821',
    note: 'Figma draws Move in the action bar for any selection. On the Users list it is left out when a selected user is in Entra, as the Entra row menu has no Move either.',
    recommendation: 'Draw an action bar variant without Move for Entra selections.',
    prototype: '#/users?select=liam-bennett',
  },
  {
    title: 'One floating layer at a time',
    file: 'primary',
    figmaNodeId: '2385:59821',
    note: 'Figma draws the action bar and the side sheet separately. In the prototype the action bar flies out while a side sheet is open and back in after it closes, and the toast and action bar fly in and out with the Iris motion tokens.',
    recommendation: 'Document the rule (one floating layer at a time) and the fly-in and fly-out motion.',
    prototype: '#/users?select=isabella-clark,liam-bennett',
  },
  {
    title: 'Paging always visible, action bar above it',
    file: 'primary',
    figmaNodeId: '82:31768',
    note: 'Figma draws the pagination under the table. In the prototype it stays at the bottom of the list while scrolling, the action bar floats above it, and one extra row of space is kept so the last row can scroll clear.',
    recommendation: 'Draw the sticky pagination with the action bar above it.',
    prototype: '#/users?select=isabella-clark',
  },
];
