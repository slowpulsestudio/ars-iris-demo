# Deep linking

Every screen, and the state a screen is in, has an address. The address is the single source of truth: a link, a refresh and the Back button all land in the same place, and the Design review tasks page links straight to the state each item is about.

An address has three parts:

```
#/admin-user/users/isabella-clark?tab=general&edit=general
 └ persona ┘└──── page ─────────┘└──── state ────────────┘
```

1. **Persona** (optional): `admin-user`, `helpdesk-user` or `self-service-end-user`. The app signs that persona in, then opens the page, in a browser that has never seen the app. `#/admin-user` alone opens the persona's start page. Without a persona, a new browser shows the persona picker first. Code: `splitPersonaHash` in `lib/router.ts`.
2. **Page**: the route, for example `#/users`, `#/users/<id>`, `#/tree/<folder>`, `#/tree/<folder>/<object>`, `#/groups`, `#/management-units/<unit>`, `#/user-view/approvals`.
3. **State** (optional): `?key=value&key=value`. It is read with `useHashParam` and written with `setHashParams` (`lib/hashState.ts`). Changing it does not add a history entry and does not trigger the unsaved-changes guard, because it is the state of a page, not a move to another page.

## State keys

| Key | Meaning | Values | Used on |
| --- | --- | --- | --- |
| `tab` | The active tab. The first tab is the default and has no value. | A slug of the tab's name without its count: `general`, `user-details`, `ownership`, `memberships`, `object-details`; on Approvals `pending`, `previous`; on My Access `active`, `pending`, `inactive`, `revoked` | User, group and OU pages, Approvals, My Access |
| `edit` | The card in edit mode. | `general` (user, group, OU), `ownership` (group, OU) | Object pages |
| `dialog` | The open dialog or side sheet. | `delete`, `reset-password`, `move`, `copy`, `rename`, `deprovision`, `deactivate`, `add-user`, `add-member`, `add-manager`, `add-owner`, `create`, `new-group`, `new-ou` | Object pages and the lists |
| `step` | The active step in a New object or New group modal. General is the default. | `account`, `exchange`, `folder` | New User and New Group modals |
| `target` | The row or rows a dialog is about. | Object ids, comma-separated | Lists |
| `type` | The object type of `dialog=create`. | `User`, `Computer`, `Contact`… | Lists |
| `select` | The ticked rows, so the selection bar shows. | Ids, comma-separated | Lists, group Memberships, Managed Units |
| `view` | A sub-view of a tab or an open request side sheet. | `members-of` (Memberships; Members is the default), `steps` (request side sheet; Request info is the default) | Group Memberships, Approvals |
| `pick` | The objects chosen in Add Member. | Ids, comma-separated | Add Member |
| `filter` | The applied Advanced filter: the filter tree as JSON. The older `Field~value1\|value2` form joined by `;` is still read. | `Tags~Security\|Helpdesk;Location~Entra` (older form), or `{"kind":"group",…}` | Users, Groups, Tree view folder lists, Managed units and their members, group Members, user Memberships and Roles |
| `sort` | The column the list is sorted by, and which way, from a column head's menu. None keeps the list's own order. | A slug of the column's name, then `asc` or `desc`: `display-name.asc`, `status.desc` | Users, Groups, Tree view folder lists, Managed units and their members, Favourites, group Members, user Memberships |
| `request` | The open approval request (its side sheet). | `REQ-001`… | Approvals |
| `modal` | The open approval modal. | `approve`, `deny`, `escalate` | Approvals |
| `sheet` | The open side sheet. | `request-access`, `select-folder` | My Access, New object modal |

Changing an object-page tab clears `edit`, `dialog`, `target`, `view`, `step` and `sheet`, so state from one tab never leaks into another. A linked New object step opens with empty fields; its main action stays disabled until the required General fields are filled.

## Examples

| State | Address |
| --- | --- |
| A user's General tab in edit mode | `#/admin-user/users/isabella-clark?tab=general&edit=general` |
| The Delete User dialog | `#/admin-user/users/isabella-clark?dialog=delete` |
| The Users list with two rows ticked | `#/admin-user/users?select=isabella-clark,liam-bennett` |
| The New User modal | `#/admin-user/users?dialog=create&type=User` |
| New AD User, Account | `#/admin-user/users?dialog=create&type=AD+User&step=account` |
| New AD Group, Select folder | `#/admin-user/groups?dialog=new-group&step=folder` |
| New User, Select folder side sheet | `#/admin-user/users?dialog=create&type=User&sheet=select-folder` |
| Move sheet for two objects in a folder | `#/admin-user/tree/o1d-builtin?select=o1d-builtin-o0,o1d-builtin-o2&dialog=move&target=o1d-builtin-o0,o1d-builtin-o2` |
| A group's Members of view | `#/admin-user/tree/o1d-builtin/o1d-builtin-o23?tab=memberships&view=members-of` |
| Add Member with one object chosen | `#/admin-user/tree/o1d-builtin/o1d-builtin-o23?tab=memberships&dialog=add-member&pick=o1d-builtin-o4` |
| A user's Memberships tab, Add Member with one group chosen | `#/admin-user/users/isabella-clark?tab=memberships&dialog=add-member&pick=helpdesk-operators` |
| An OU's Ownership card, picking a manager | `#/admin-user/tree/o1d-local/o1d-test-ou?tab=ownership&edit=ownership&dialog=add-manager` |
| The Approve modal over a pending request | `#/self-service-end-user/user-view/approvals?tab=pending&request=REQ-001&modal=approve` |
| A request's side sheet, Request steps tab | `#/self-service-end-user/user-view/approvals?tab=pending&request=REQ-001&view=steps` |
| An approval action from a table row | `#/self-service-end-user/user-view/approvals?tab=pending&target=REQ-001&modal=approve` |
| The Request Access sheet | `#/self-service-end-user/user-view/my-access?sheet=request-access` |

## What can't be linked

Some states can't be reached from an address, and the review items for them still say what to click: open menus (row menu, Create, filter), the waiting and success steps of Delete and Reset password, the Unsaved changes modal and a save error (they need a field changed first), toasts, the cards on a user's User Details tab, and dragging a row onto a folder.

## Rules for new screens

1. Keep a page's state in the address with `useHashParam`, `useHashTab` or `useHashSelection`, not in `useState`. A `useState` copy can disagree with the address.
2. When a state is turned on by an address (an edit form, a dialog), set up what it needs on arrival. An effect on the state, not on the click that used to turn it on, fills the form from the saved values.
3. Moving to another object uses a plain address, which drops the state of the old one.
4. Use stable ids in addresses (the object's id, never its position).
5. Add the new state to the table above and add a Prototype link to the review item.
