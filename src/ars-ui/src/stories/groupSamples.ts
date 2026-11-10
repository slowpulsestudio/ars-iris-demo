export interface GroupSample {
  name: string;
  description: string;
}

export const GROUP_OBJECT_ID = 'c5f3d4e6-9g1b-6h4c-da5e-3f4a5b6c7d8e';

/** Figma's sample groups for ARS_Table_Group_Row and ARS_Group_Table. */
export const GROUPS: Record<string, GroupSample> = {
  securityUsers: { name: 'Security Users', description: 'This security group protects our digital assets and ensures compliance.' },
  allCompany: { name: 'All Company', description: 'Ensuring that all initiatives align with industry standards and best practices.' },
  marketingTeam: {
    name: 'Marketing Team',
    description:
      'The marketing group focuses on aligning all strategies with current industry standards and best practices to drive effective campaigns.',
  },
  developmentCrew: { name: 'Development Crew', description: 'Making sure all projects meet industry standards and follow best practices.' },
  salesDivision: {
    name: 'Sales Division',
    description: 'The AD sales group is dedicated to aligning all its initiatives with the latest industry standards and best practices.',
  },
  customerSupport: {
    name: 'Customer Support',
    description: 'This group focuses on platforms, ensuring that all initiatives align with industry standards and best practices.',
  },
  productManagement: { name: 'Product Management', description: 'Ensuring that all initiatives align with industry standards and best practices.' },
  humanResources: {
    name: 'Human Resources',
    description:
      'Managing the security and compliance of our enterprise platforms, ensuring that all initiatives align with industry standards and best practices.',
  },
};
