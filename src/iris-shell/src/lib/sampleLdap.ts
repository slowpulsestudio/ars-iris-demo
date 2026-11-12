/**
 * The query shown in the Advanced filter Panel's Query syntax view ("{ }"). It is the sample text from
 * Figma (ARS_WebUI2_Advanced-Search "Query" 4113:92324, Code multi line 4080:14362), not built from the
 * filter: the view is cosmetic for now.
 */
export const SAMPLE_LDAP = `(&
  (objectClass=user)
  (objectCategory=person)
  (!(userAccountControl:.1.4.803:=2))
  (mail=*)
  (|
    (department=Sales)
    (department=Marketing)
  )
  (memberOf=CN=Remote-Users,DC=com)
  (whenCreated>=20250101000000.0Z)
  (!
    (|
      (cn=svc-*)
      (cn=sys-*)
      (description=*service account*)
    )
  )
  (!(distinguishedName=DC=contoso,DC=com))
)`;
