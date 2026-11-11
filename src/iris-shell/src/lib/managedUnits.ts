/**
 * managedUnits — sample managed units and their members, from the Figma
 * sample rows (ARS_Managed_Users_Content 7058:6179, ARS_Managed_Unit_Members
 * 7074:6939). The app has no managed-unit data of its own.
 */

export interface ManagedUnit {
  id: string;
  name: string;
  modified: string;
  description: string;
}

export interface ManagedUnitMember {
  id: string;
  name: string;
  description: string;
  type: 'User' | 'Group';
}

export const MANAGED_UNITS: ManagedUnit[] = [
  { id: 'global-security', name: 'Global Security', modified: '10/24/23', description: 'Centralized security policies and access controls.' },
  { id: 'engineering', name: 'Engineering', modified: '10/22/23', description: 'Platform infrastructure and backend services.' },
  { id: 'hr-operations', name: 'HR Operations', modified: '10/18/23', description: 'Employee onboarding and benefits management.' },
  { id: 'finance-admin', name: 'Finance Admin', modified: '10/15/23', description: 'Financial reporting and budget approvals.' },
  { id: 'marketing', name: 'Marketing', modified: '10/12/23', description: 'Campaign assets and brand guidelines.' },
  { id: 'sales-enablement', name: 'Sales Enablement', modified: '10/10/23', description: 'Sales collateral and training materials.' },
  { id: 'legal-docs', name: 'Legal Docs', modified: '10/08/23', description: 'Contracts and compliance documentation.' },
  { id: 'it-support', name: 'IT Support', modified: '10/05/23', description: 'Helpdesk tickets and hardware inventory.' },
  { id: 'product-design', name: 'Product Design', modified: '10/02/23', description: 'Design systems and UX research.' },
  { id: 'analytics', name: 'Analytics', modified: '09/28/23', description: 'Data dashboards and reporting tools.' },
  { id: 'cloud-ops', name: 'Cloud Ops', modified: '09/25/23', description: 'Cloud infrastructure and monitoring.' },
  { id: 'compliance', name: 'Compliance', modified: '09/22/23', description: 'Regulatory audits and risk assessments.' },
  { id: 'customer-success', name: 'Customer Success', modified: '09/19/23', description: 'Customer onboarding and retention.' },
  { id: 'data-science', name: 'Data Science', modified: '09/16/23', description: 'Machine learning models and data pipelines.' },
  { id: 'facilities', name: 'Facilities', modified: '09/13/23', description: 'Office management and facilities maintenance.' },
];

const SAMPLE_MEMBERS: Omit<ManagedUnitMember, 'id'>[] = [
  { name: 'Sophia Reyes', description: 'Senior Platform Engineer', type: 'User' },
  { name: 'Nadia Patel', description: 'Product Designer', type: 'User' },
  { name: 'Ava Morgan', description: 'HR Operations Lead', type: 'User' },
  { name: 'Ethan Hayes', description: 'Helpdesk Manager', type: 'User' },
  { name: 'Mia Foster', description: 'Platform Administrator', type: 'User' },
  { name: 'Lucas Grant', description: 'HR Coordinator', type: 'User' },
  { name: 'Isabella Reed', description: 'Compliance Analyst', type: 'User' },
  { name: 'Mason Clarke', description: 'HR Operations Manager', type: 'User' },
  { name: 'Lena Foster', description: 'Product Design Lead', type: 'User' },
  { name: 'Marcus Chen', description: 'Backend Engineer', type: 'User' },
  { name: 'Jamal Rivera', description: 'Cloud Engineer', type: 'User' },
  { name: 'Priya Sharma', description: 'Data Analyst', type: 'User' },
  { name: 'Elena Dubois', description: 'Legal Counsel', type: 'User' },
  { name: 'Engineering Team', description: 'Platform and backend services team', type: 'Group' },
  { name: 'Finance Admin', description: 'Financial reporting and approvals', type: 'Group' },
];

export function getManagedUnit(id: string): ManagedUnit | undefined {
  return MANAGED_UNITS.find((u) => u.id === id);
}

/** A unit's members: the sample members, rotated by the unit's position so each unit differs. */
export function membersOf(unitId: string): ManagedUnitMember[] {
  const at = Math.max(0, MANAGED_UNITS.findIndex((u) => u.id === unitId));
  const count = 8 + (at % 8);
  return Array.from({ length: count }, (_, i) => {
    const sample = SAMPLE_MEMBERS[(at + i) % SAMPLE_MEMBERS.length];
    return { ...sample, id: `${unitId}-m${i}` };
  });
}
