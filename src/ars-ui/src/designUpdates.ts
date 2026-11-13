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
    title: 'Split Create on Groups: AD group or Entra group',
    file: 'groups',
    figmaNodeId: '160:9037',
    note: 'Figma draws a plain "+ Create" on the Groups list. At the designer\'s request it is a split button, and either half opens a menu with AD group and Entra group, each opening its own form.',
    recommendation: 'Draw the split Create and its menu with the two options.',
    prototype: '#/groups',
  },
  {
    title: 'New Entra Distribution Group form',
    file: 'groups',
    figmaNodeId: '2109:11016',
    note: 'The template for it still holds the generic user form ("New [Object Type]", First name, Last name), and the draft (2109:10890) has placeholder labels. The prototype builds the form from the written requirement (2113:12494) in the draft\'s layout: Name, Display name, Description, Primary SMTP address and domain, Hide from the global address list, and the Joining and Leaving group toggles with info icons.',
    recommendation: 'Fill the template with the Entra group fields and replace the draft\'s placeholder labels.',
    prototype: '#/groups?dialog=new-entra-group',
  },
  {
    title: 'Advanced filter Panel on the lists, Bar in the Add Member modal',
    file: 'primary',
    figmaNodeId: '2613:23294',
    note: 'The Advanced Search file draws the Panel docked beside a list (4090:114583) and a count badge on the Filters button, and the Iris UI Kit draws the Panel (9956:7605) and the Bar (9722:13727). It does not draw the lists other than Users, the Bar in the Add Member modal, or the Favorites filter. The prototype puts the Panel on every list with a Filters button, the Bar in the Add Member modal, the manager and owner pickers and Favourites. The Panel shows one "Common" group of fields where Figma has Common, User, Computer and Groups; the query syntax view shows the sample LDAP from Figma and does not follow the filter, and the "Read the filters guide" link is not wired. A favourite folder follows ARS - Favorites (4145:13627) in the Favourites view, with the Bar drawn as ARS filter tags; the panel\'s saved "Views" are not built, and its date-between pill is an "is between" operator that the Iris UI Kit does not have yet.',
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
  {
    title: 'Empty states: Iris empty state with Hairline figures',
    file: 'primary',
    figmaNodeId: '3423:30769',
    note: 'ARS_Empty_Content draws the older "No data" drawing (3367:42208) above the message and button. At the designer\'s request every empty state in the prototype uses the Iris empty state with a Hairline figure, the style the Tree view and the directory picker already had: an empty filing cabinet (Drawer) for a folder with no objects, and sieves (Sieve) when a filter matches nothing on any list.',
    recommendation: 'Swap the "No data" drawing in ARS_Empty_Content for the Iris empty state with a Hairline figure, and draw the "No objects match the filter." state with Clear filter.',
    prototype: '#/users?filter=Tags~Zzzz',
  },
  {
    title: 'Memberships empty states',
    file: 'groups',
    figmaNodeId: '167:6097',
    note: 'Figma draws the Memberships tab with rows only, no empty state. The prototype uses the Iris empty state: a hub (Hub) with "[name] is not a member of any group." or "This group has no members." and Add groups or Add members, and a loupe (Loupe) with Clear search when the search finds nothing. To see it, remove both of Isabella Clark\'s groups or search for a name that isn\'t there.',
    recommendation: 'Draw the two Memberships empty states (no memberships, no search match) for users and groups with the Iris empty state.',
    prototype: '#/users/isabella-clark?tab=memberships',
  },
  {
    title: 'Bulk action bar wherever rows can be ticked',
    file: 'primary',
    figmaNodeId: '2385:59821',
    note: 'Figma draws the bar on the Users and Tree view lists and a managed unit\'s members. At the designer\'s request the same bar shows on the Groups and Managed Units lists, the Memberships and Roles tabs and Favourites. Select all, Properties (one row) and Ask AI work everywhere, and on the Groups list Move and More actions work too; Copy, Move and Delete do nothing where there is no flow for them.',
    recommendation: 'Draw the bar on these screens and decide which actions each needs (for example Remove on Memberships).',
    prototype: '#/tree/o1d-builtin/o1d-builtin-o1?tab=memberships&select=o1d-test-ou-o2261,o1d-test-ou-o2266',
  },
];
