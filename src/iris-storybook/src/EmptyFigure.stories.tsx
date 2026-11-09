import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dish, Elevator, Riffle, Turntable } from '@lucasmarkes/hairline/react';
import { Button } from '@iris/components/Button/Button.js';
import { EmptyFigure } from '@iris/components/EmptyFigure/EmptyFigure.js';

const meta = {
  title: 'Iris/EmptyFigure',
  component: EmptyFigure,
  parameters: {
    docs: {
      description: {
        component:
          'Empty-state surface that pairs a themed Hairline figure with a title and description. Iris code: src/iris-shell/src/components/EmptyFigure.',
      },
    },
  },
  args: {
    figure: Turntable,
    title: 'No favourites yet',
    description: 'Star an object to see it here.',
  },
  argTypes: { figure: { control: false } },
} satisfies Meta<typeof EmptyFigure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  name: 'With action',
  args: {
    figure: Riffle,
    title: 'No directories yet',
    description: 'Connect a directory source to see its breakdown here.',
    action: <Button variant="secondary" iconLead="Plus">Add directory</Button>,
  },
};

export const FigureOnly: Story = {
  name: 'Figure only',
  args: { figure: Dish, title: undefined, description: undefined, label: 'Member of' },
};

export const Figures: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--oi-spacing-xl)' }}>
      <EmptyFigure {...args} figure={Turntable} title="Turntable" description={undefined} />
      <EmptyFigure {...args} figure={Elevator} title="Elevator" description={undefined} />
      <EmptyFigure {...args} figure={Riffle} title="Riffle" description={undefined} />
      <EmptyFigure {...args} figure={Dish} title="Dish" description={undefined} />
    </div>
  ),
};
