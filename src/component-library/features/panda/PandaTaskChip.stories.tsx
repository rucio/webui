import type { Meta, StoryObj } from '@storybook/nextjs';
import { PandaTaskChip } from './PandaTaskChip';

const meta: Meta<typeof PandaTaskChip> = {
    title: 'Features/PanDA/PandaTaskChip',
    component: PandaTaskChip,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'ATLAS only (flag `dids.panda_task`). PanDA task id parsed from a DID name (tid suffix of the Version field, or the task field of file names), linked to BigPanDA in a new tab.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PandaTaskChip>;

export const Linked: Story = {
    args: { taskId: '34870879', url: 'https://bigpanda.cern.ch/task/?jeditaskid=34870879' },
};

export const Loading: Story = {
    args: { taskId: '34870879', isLoading: true },
};
