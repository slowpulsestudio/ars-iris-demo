# ARS component map

What each Active Roles (ARS) product component in the **ARS - Primary** Figma file is built from, and where it's used. The file link is in `.figma-url`.

Made on 9 November 2026 by reading Figma only — nothing in Figma was changed. Every link was traced through Figma's own links between components, not layer names.

**Scope:** the 72 components on the file's **Iris UI** page — 69 in the *ARS Components* section and 3 in the *Testing* section (ARS_Modal_Content_Success, ARS_Modal_Content_Delete, ARS_Delete_Confirmation_Modal_Template).

**How to read the reference**
- **ARS components inside** — other current ARS components this one contains.
- **Iris code components** — pieces Figma links straight to Iris code (Button, AppHeader, Select).
- **Outside pieces** — components that aren't on any page of the ARS file. Figma doesn't say which file they come from; the Iris UI Kit is the only component library linked to the ARS file.
- Counts add up across all variants of a component.

## How the components fit together

Only these ARS components contain other ARS components:

```
ARS_Flat_Master
├─ AppHeader (Iris)
├─ ARS_Directory_Management_Panel
│   └─ ARS_Directory_Management_Content
└─ ARS_Flat View_User_Content
    ├─ ARS_Header
    ├─ ARS_Table_Toolbar
    ├─ ARS_Table_Config
    ├─ ARS_Row ×15
    └─ ARS_Pagination

ARS_App_Layout_Flat_View
├─ AppHeader (Iris)
├─ ARS_Directory_Management_Panel → ARS_Directory_Management_Content
└─ ARS_Main_Content Placeholder

ARS_Treeview_Master
├─ ARS_Directory_Management_Panel → ARS_Directory_Management_Content
└─ Tree_View_AD_Content
    ├─ ARS_Header
    ├─ ARS_Table_Toolbar
    └─ ARS_Pagination

ARS_User_Page
├─ ARS_User_Page_Header
└─ ARS_Object_Content
    ├─ ARS_User_Page_Tabs
    └─ 3 older cards (see problem 1)

ARS_Group_Page
├─ ARS_Page_Header (the single one)
├─ ARS_Page_Tabs
└─ ARS_Group_General content (an outside copy, see problem 1)

ARS_Page_Content → ARS_Group_General content, ARS_Page_Action panel
ARS_Table → ARS_Row, ARS_Pagination, ARS.Table head_Mixed_obj (Mixed only)
ARS_Group_Table → ARS_Table_Group_Row ×9
ARS_filter-select → ARS_filter-remove, ARS_object-selected, ARS_object-rule
ARS_New_Object_Content_Container → ARS_Stepper_with_div (+ an older ARS_New_Object_Content)
ARS_Password_Reset_Entra_User → Reset_Content success
```

The other 36 ARS components neither contain nor sit inside another ARS component — all the menus, the cards, the modals and form pieces, the toast, the action bar, the sidebar, and more.

## Pieces from outside the ARS file

**Linked to Iris code** (Figma names the Iris code component):
- **Button** — used directly in 11 ARS components, plus 3 inside the toast
- **AppHeader** — in ARS_Flat_Master and ARS_App_Layout_Flat_View
- **Select** — the directory picker inside ARS_Directory_Management_Panel

**Other outside pieces:**
- Menus: menu item, menu separator, menu
- Tables: table cell, table header cell, page action (pagination), checkbox
- Forms: text input, text area, label, link, input feedback message, banner
- Navigation: sidebar, sidebar header, main nav item, tab item, breadcrumb item, directory-tree pieces
- Other: toast, action bar, stepper, modal footer, tag, avatar, cloud badge, spinner, split button, multi-select item, Delete Object
- Icons throughout

## Problems found

1. **ARS-named parts linked to the wrong component** — they carry ARS names but aren't the current ARS components:
   - ARS_Empty_Content: its ARS_Header and ARS_Table_Toolbar come from another Figma file.
   - ARS_Sub_Tabs_Template: its ARS_Group_Header and ARS_Group_Tabs come from another file. No components with those names exist in the ARS file.
   - ARS_Group_Page: its ARS_Group_General content comes from another file.
   - ARS_New_Object_Content_Container: uses a hidden older ARS_New_Object_Content.
   - ARS_Object_Content: its three cards are the older Properties, Job Info and ContactInfo cards on the *Test Area* page. Nothing uses the current ARS_users cards.
2. **Plain copies instead of components:**
   - ARS_Action_bar: variants "2" and "Variant3" aren't linked to the action bar component.
   - ARS_Table: the header rows are plain frames; ARS.Table head_single_obj exists but nothing uses it. The Empty variant's header and empty state are plain frames too.
   - ARS_Create_Menu_Button's button and ARS_Pagination's "10 / page" button are plain frames.
   - The input fields in Reset_Content success, ARS_Modal_Content_Success and ARS_Modal_Content_Delete are plain copies.
3. **Table not reused:** ARS_Flat View_User_Content doesn't use ARS_Table — it places 15 ARS_Rows, the pagination and header cells itself.
4. **Two menu separators:** the AD and Entra user-action menus use one hidden menu-separator component; the other menus use a different one.
5. **Code link to a missing file:** ARS_New_Object_Template is linked in Figma to `src/iris-shell/src/views/UsersPage/NewUserModal.tsx`. That file isn't in this project — it only exists in the `Injest/` reference projects.

## Limits

- Figma leaves hidden layers out of these reads, so anything hidden isn't in this map.
- For outside pieces, Figma doesn't say which file they come from, apart from the Iris code links.

## Component reference

### ARS_.Modal_New_Object_Footer
Figma ID 3321:20516 · 3 variants

- **Outside pieces:** Checkbox ×3
- **Used inside:** no other ARS component
- **Note:** The "Step x of 2" text sits inside a Checkbox component

### ARS_Action_bar
Figma ID 2385:59821 · 3 variants

- **Outside pieces:** Action bar ×1
- **Used inside:** no other ARS component
- **Note:** Only the Default variant uses the action bar component; variants "2" and "Variant3" are unlinked copies

### ARS_AD Bulk User Actions
Figma ID 2385:57425

- **Outside pieces:** Menu ×1
- **Used inside:** no other ARS component

### ARS_AD Bulk User Flat View
Figma ID 2385:57426

- **Outside pieces:** Menu ×1
- **Used inside:** no other ARS component

### ARS_AD Right Click Tree Menu
Figma ID 2385:57427

- **Outside pieces:** Menu item ×4, Menu separator ×1
- **Used inside:** no other ARS component

### ARS_AD User Actions
Figma ID 2275:90709

- **Outside pieces:** Menu item ×12, Menu separator ×2
- **Used inside:** no other ARS component

### ARS_App_Layout_Flat_View
Figma ID 2385:56316

- **ARS components inside:** ARS_Directory_Management_Panel ×1, ARS_Main_Content Placeholder ×1
- **Iris code components:** AppHeader — Collapsed Sidebar ×1
- **Used inside:** no other ARS component

### ARS_Create_Menu_Button
Figma ID 3360:40921 · 3 variants

- **Built from:** plain frames, text and icons only
- **Used inside:** no other ARS component
- **Note:** Its "Button" is a plain frame, not the Iris Button

### ARS_Delete_Confirmation_Modal_Template
Figma ID 2385:59716

- **Outside pieces:** Delete Object ×1
- **Used inside:** no other ARS component

### ARS_Directory_Management_Content
Figma ID 3563:17386 · 5 variants

- **Outside pieces:** Main nav item ×12, Tree-Leading Icons ×8, Tree-Tree Element ×27, Text input ×1, Tree Trail Zone ×2, Tree-Text Zone ×1
- **Used inside:** ARS_Directory_Management_Panel

### ARS_Directory_Management_Panel
Figma ID 2385:54213 · 5 variants

- **ARS components inside:** ARS_Directory_Management_Content ×5
- **Used inside:** ARS_App_Layout_Flat_View, ARS_Treeview_Master, ARS_Flat_Master

### ARS_Directory_Multiselect
Figma ID 4596:20589

- **Iris code components:** Button — Ghost · Text only · Default ×2
- **Outside pieces:** Input ×1, Multi-select item ×6
- **Used inside:** no other ARS component

### ARS_Empty_Content
Figma ID 3423:30769

- **Iris code components:** Button — Secondary · Icon + Text · Default ×1
- **Outside pieces:** ARS_Header (outside copy, not the current component) ×1, ARS_Table_Toolbar (outside copy, not the current component) ×1
- **Used inside:** no other ARS component

### ARS_Entra User Actions
Figma ID 2275:90868

- **Outside pieces:** Menu item ×5, Menu separator ×2
- **Used inside:** no other ARS component

### ARS_Filter_Menu
Figma ID 3064:26920

- **Outside pieces:** Menu item ×6, Menu separator ×1
- **Used inside:** no other ARS component

### ARS_filter-remove
Figma ID 2650:24557 · 2 variants

- **Built from:** plain frames, text and icons only
- **Used inside:** ARS_filter-select

### ARS_filter-select
Figma ID 2650:24519 · 2 variants

- **ARS components inside:** ARS_filter-remove ×1, ARS_object-selected ×3, ARS_object-rule ×2
- **Used inside:** no other ARS component

### ARS_Flat View_User_Content
Figma ID 3423:30755

- **ARS components inside:** ARS_Header ×1, ARS_Table_Toolbar ×1, ARS_Table_Config ×1, ARS_Row ×15, ARS_Pagination ×1
- **Outside pieces:** Table head item ×5
- **Used inside:** ARS_Flat_Master

### ARS_Flat_Master
Figma ID 4006:17053

- **ARS components inside:** ARS_Directory_Management_Panel ×1, ARS_Flat View_User_Content ×1
- **Iris code components:** AppHeader — Collapsed Sidebar ×1
- **Used inside:** no other ARS component

### ARS_Form_Error
Figma ID 3621:46744

- **Iris code components:** Button — Secondary · Text only · Small ×1, Button — Primary · Text only · Small ×1
- **Outside pieces:** Banner ×1, Text input ×8
- **Used inside:** no other ARS component

### ARS_Group_General content
Figma ID 2944:30704 · 3 variants

- **Iris code components:** Button — Secondary · Text only · Small ×1, Button — Primary · Icon + Text · Small ×1
- **Outside pieces:** Cloud Badge ×4, Text input ×5, Text area ×1
- **Used inside:** ARS_Page_Content

### ARS_Group_Page
Figma ID 2944:29514

- **ARS components inside:** ARS_Page_Header (single) ×1, ARS_Page_Tabs ×1
- **Outside pieces:** ARS_Group_General content (outside copy, not the current component) ×1
- **Used inside:** no other ARS component

### ARS_Group_Table
Figma ID 2843:24904

- **ARS components inside:** ARS_Table_Group_Row ×9
- **Outside pieces:** Table head item ×5
- **Used inside:** no other ARS component

### ARS_Header
Figma ID 3368:19597 · 5 variants

- **Outside pieces:** Tag ×1
- **Used inside:** Tree_View_AD_Content, ARS_Flat View_User_Content

### ARS_Main_Content Placeholder
Figma ID 3429:18447

- **Built from:** plain frames, text and icons only
- **Used inside:** ARS_App_Layout_Flat_View

### ARS_Managed_by
Figma ID 3527:16182 · 5 variants

- **Outside pieces:** Link ×6, Text input ×14
- **Used inside:** no other ARS component

### ARS_Modal_Content_Delete
Figma ID 3651:44611

- **Outside pieces:** Input feedback messages ×1
- **Used inside:** no other ARS component
- **Note:** Input field is a plain copy

### ARS_Modal_Content_Success
Figma ID 3651:44368

- **Outside pieces:** Input feedback messages ×1
- **Used inside:** no other ARS component
- **Note:** Input field is a plain copy

### ARS_New Object Menu
Figma ID 3066:57117

- **Outside pieces:** Menu item ×10, Menu separator ×3
- **Used inside:** no other ARS component

### ARS_New User Entra Dir
Figma ID 2275:91121 · 3 variants

- **Outside pieces:** Menu item ×7
- **Used inside:** no other ARS component

### ARS_New_Object_Content
Figma ID 3493:17061 · 2 variants

- **Outside pieces:** Text input ×10, Checkbox ×4
- **Used inside:** no other ARS component

### ARS_New_Object_Content_Container
Figma ID 3367:12347

- **ARS components inside:** ARS_Stepper_with_div ×1
- **Outside pieces:** ARS_New_Object_Content (outside copy, not the current component) ×1
- **Used inside:** no other ARS component

### ARS_New_Object_Template
Figma ID 3367:12947

- **Linked to code:** NewUserModal (src/iris-shell/src/views/UsersPage/NewUserModal.tsx)
- **Iris code components:** Button — Ghost · Icon only · Small ×1, Button — Secondary · Icon + Text · Default ×1, Button — Primary · Text only · Default · Disabled ×1
- **Used inside:** no other ARS component

### ARS_New_Object_Toast
Figma ID 4029:38684

- **Outside pieces:** Toast ×1
- **Used inside:** no other ARS component

### ARS_Object_Content
Figma ID 2385:56718 · 2 variants

- **ARS components inside:** ARS_User_Page_Tabs ×2
- **Outside pieces:** Properties Card (older card on the Test Area page) ×1, ContactInfo Card (older card on the Test Area page) ×1, Job Info Card (older card on the Test Area page) ×1
- **Used inside:** ARS_User_Page

### ARS_object-rule
Figma ID 2650:24550 · 3 variants

- **Built from:** plain frames, text and icons only
- **Used inside:** ARS_filter-select

### ARS_object-selected
Figma ID 2650:24543 · 2 variants

- **Built from:** plain frames, text and icons only
- **Used inside:** ARS_filter-select

### ARS_Overview_Template
Figma ID 3353:38318 · 3 variants

- **Outside pieces:** Avatar ×2, Cloud Badge ×3
- **Used inside:** no other ARS component

### ARS_Ownership
Figma ID 3527:16049 · 8 variants

- **Outside pieces:** Text input ×4, Link ×6
- **Used inside:** no other ARS component

### ARS_Page Menu
Figma ID 3663:20458

- **Outside pieces:** Menu item ×4, Menu separator ×2
- **Used inside:** no other ARS component

### ARS_Page_Action panel
Figma ID 2944:29985

- **Built from:** plain frames, text and icons only
- **Used inside:** ARS_Page_Content

### ARS_Page_Content
Figma ID 2944:30346

- **ARS components inside:** ARS_Group_General content ×1, ARS_Page_Action panel ×1
- **Used inside:** no other ARS component

### ARS_Page_Header (set)
Figma ID 3066:57118 · 3 variants

- **Built from:** plain frames, text and icons only
- **Used inside:** no other ARS component
- **Note:** Item navigation area is empty in all three variants

### ARS_Page_Header (single)
Figma ID 2944:30067

- **Iris code components:** Button — Ghost · Icon only · Default ×4
- **Used inside:** ARS_Group_Page

### ARS_Page_Tabs
Figma ID 2944:30035

- **Outside pieces:** Tab item ×6
- **Used inside:** ARS_Group_Page

### ARS_Pagination
Figma ID 82:31768

- **Outside pieces:** Page action ×10
- **Used inside:** Tree_View_AD_Content, ARS_Table, ARS_Flat View_User_Content

### ARS_Password_Reset_Entra_User
Figma ID 4486:19008 · 1 variant

- **ARS components inside:** Reset_Content success ×1
- **Outside pieces:** Modal-Footer ×1
- **Used inside:** no other ARS component

### ARS_Row
Figma ID 111:29461 · 2 variants

- **Outside pieces:** Cell item ×11
- **Used inside:** ARS_Table, ARS_Flat View_User_Content

### ARS_Sidebar
Figma ID 2385:56389

- **Outside pieces:** Sidebar ×1
- **Used inside:** no other ARS component

### ARS_Stepper_with_div
Figma ID 3367:11939

- **Outside pieces:** Stepper ×1
- **Used inside:** ARS_New_Object_Content_Container

### ARS_Sub_Tabs_Template
Figma ID 4503:19905

- **Iris code components:** Button — Primary · Icon + Text · Default ×1
- **Outside pieces:** ARS_Group_Header (outside copy, not the current component) ×1, ARS_Group_Tabs (outside copy, not the current component) ×1, Text input ×1
- **Used inside:** no other ARS component

### ARS_Table
Figma ID 99:30760 · 4 variants

- **ARS components inside:** ARS.Table head_Mixed_obj ×1, ARS_Row ×44, ARS_Pagination ×3
- **Outside pieces:** Table head item ×10
- **Used inside:** no other ARS component
- **Note:** Empty variant: header row and empty state are plain frames

### ARS_Table Menu
Figma ID 3663:20381

- **Outside pieces:** Menu item ×4, Menu separator ×2
- **Used inside:** no other ARS component

### ARS_Table_Config
Figma ID 3663:19416

- **Iris code components:** Button — Ghost · Icon only · Default ×1
- **Used inside:** ARS_Flat View_User_Content

### ARS_Table_Group_Row
Figma ID 2843:24711 · 24 variants

- **Outside pieces:** Cell item ×120
- **Used inside:** ARS_Group_Table

### ARS_Table_Header
Figma ID 3368:12193 · 1 variant

- **Built from:** plain frames, text and icons only
- **Used inside:** no other ARS component

### ARS_Table_Row_Header
Figma ID 2385:56534 · 2 variants

- **Built from:** plain frames, text and icons only
- **Used inside:** no other ARS component

### ARS_Table_Toolbar
Figma ID 2613:23294 · 4 variants

- **Outside pieces:** Text input ×4, Button split ×2
- **Used inside:** Tree_View_AD_Content, ARS_Flat View_User_Content

### ARS_Treeview_Master
Figma ID 3367:42088

- **ARS components inside:** ARS_Directory_Management_Panel ×1, Tree_View_AD_Content ×1
- **Iris code components:** Button — Ghost · Icon only · Default ×2
- **Outside pieces:** Sidebar Header ×1, Breadcrumb Item ×4, AI CTA ×1, Avatar ×1
- **Used inside:** no other ARS component

### ARS_User_Page
Figma ID 3129:8132 · 1 variant

- **ARS components inside:** ARS_User_Page_Header ×1, ARS_Object_Content ×1
- **Used inside:** no other ARS component

### ARS_User_Page_Header
Figma ID 3598:47947

- **Iris code components:** Button — Ghost · Icon only · Default ×4
- **Used inside:** ARS_User_Page

### ARS_User_Page_Tabs
Figma ID 3598:46761

- **Outside pieces:** Tab item ×11
- **Used inside:** ARS_Object_Content

### ARS_User_Password_Reset_AD
Figma ID 4486:18890 · 4 variants

- **Outside pieces:** Label ×2, Input Feedback Messages ×1, Text input ×4, Checkbox ×8, Spinner ×1, Modal-Footer ×4
- **Used inside:** no other ARS component

### ARS_Users_ContactInfo Card
Figma ID 2820:30082 · 2 variants

- **Outside pieces:** Text input ×9
- **Used inside:** no other ARS component

### ARS_Users_Job Info Card
Figma ID 2820:29901 · 2 variants

- **Outside pieces:** Text input ×9
- **Used inside:** no other ARS component

### ARS_users_Properties Card
Figma ID 2820:29757 · 2 variants

- **Outside pieces:** Text input ×6, Text area ×1
- **Used inside:** no other ARS component

### ARS.Table head_Mixed_obj
Figma ID 3423:28002

- **Outside pieces:** Table head item ×5
- **Used inside:** ARS_Table

### ARS.Table head_single_obj
Figma ID 3423:27419

- **Outside pieces:** Table head item ×6
- **Used inside:** no other ARS component

### Create menu
Figma ID 3360:40902

- **Outside pieces:** Menu item ×7, Menu separator ×3
- **Used inside:** no other ARS component

### Entra User Bulk Actions
Figma ID 2275:91260

- **Outside pieces:** Menu item ×3, Menu separator ×1
- **Used inside:** no other ARS component

### Reset_Content success
Figma ID 4486:19024 · 2 variants

- **Built from:** plain frames, text and icons only
- **Used inside:** ARS_Password_Reset_Entra_User
- **Note:** Password field is a plain copy of a text input

### Tree_View_AD_Content
Figma ID 4517:19943

- **ARS components inside:** ARS_Header ×1, ARS_Table_Toolbar ×1, ARS_Pagination ×1
- **Iris code components:** Button — Ghost · Icon only · Default ×17
- **Outside pieces:** Table head item ×4, Cell item ×60
- **Used inside:** ARS_Treeview_Master
