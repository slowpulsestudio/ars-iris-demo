import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuerySyntax } from './QuerySyntax.js';

const LDAP = `(&
  (objectClass=user)
  (objectCategory=person)
  (!(userAccountControl:1.2.840.113556.1.4.803:=2))
  (mail=*)
  (|
    (department=Sales)
    (department=Marketing)
  )
  (memberOf=CN=Remote-Users,DC=com)
)`;

const meta = {
  title: 'Iris new/Advanced filter/Query syntax',
  component: QuerySyntax,
  parameters: {
    docs: { description: { component: 'Figma: Iris UI Kit · Query syntax panel · 10012:4232' } },
  },
  decorators: [(Story) => <div style={{ width: 480 }}><Story /></div>],
  args: { syntaxes: [{ id: 'ldap', label: 'LDAP', code: LDAP }] },
} satisfies Meta<typeof QuerySyntax>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
