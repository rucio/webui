import type { Meta, StoryObj } from '@storybook/nextjs';
import { DetailActions } from './DetailActions';
import { Button } from '@/component-library/atoms/form/button';
import { HiOutlineTrash, HiOutlineLightningBolt, HiOutlineAdjustments } from 'react-icons/hi';

const meta: Meta<typeof DetailActions> = {
    title: 'Features/Mutations/DetailActions',
    component: DetailActions,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    decorators: [
        Story => (
            <div className="max-w-4xl mx-auto">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof DetailActions>;

export const RuleActions: Story = {
    render: () => (
        <DetailActions>
            <Button variant="error" size="sm">
                <HiOutlineTrash className="mr-1.5 h-4 w-4" />
                Delete Rule
            </Button>
            <Button variant="default" size="sm">
                <HiOutlineLightningBolt className="mr-1.5 h-4 w-4" />
                Boost Rule
            </Button>
            <Button variant="neutral" size="sm">
                <HiOutlineAdjustments className="mr-1.5 h-4 w-4" />
                Update Priority
            </Button>
        </DetailActions>
    ),
};

export const RSEActions: Story = {
    render: () => (
        <DetailActions>
            <Button variant="default" size="sm">
                Add Attribute
            </Button>
        </DetailActions>
    ),
};

export const SingleAction: Story = {
    render: () => (
        <DetailActions>
            <Button variant="error" size="sm">
                <HiOutlineTrash className="mr-1.5 h-4 w-4" />
                Delete
            </Button>
        </DetailActions>
    ),
};

export const InPageContext: Story = {
    render: () => (
        <div className="flex flex-col space-y-6 w-full">
            <header>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">abc123def456-rule-id</h1>
            </header>
            <DetailActions>
                <Button variant="error" size="sm">
                    <HiOutlineTrash className="mr-1.5 h-4 w-4" />
                    Delete Rule
                </Button>
                <Button variant="default" size="sm">
                    <HiOutlineLightningBolt className="mr-1.5 h-4 w-4" />
                    Boost Rule
                </Button>
                <Button variant="neutral" size="sm">
                    <HiOutlineAdjustments className="mr-1.5 h-4 w-4" />
                    Update Priority
                </Button>
            </DetailActions>
            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6">
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">Tab content / metadata would appear below</p>
            </div>
        </div>
    ),
};

export const DarkMode: Story = {
    render: () => (
        <div className="dark p-8 rounded-lg bg-neutral-900">
            <DetailActions>
                <Button variant="error" size="sm">
                    <HiOutlineTrash className="mr-1.5 h-4 w-4" />
                    Delete Rule
                </Button>
                <Button variant="default" size="sm">
                    <HiOutlineLightningBolt className="mr-1.5 h-4 w-4" />
                    Boost Rule
                </Button>
                <Button variant="neutral" size="sm">
                    <HiOutlineAdjustments className="mr-1.5 h-4 w-4" />
                    Update Priority
                </Button>
            </DetailActions>
        </div>
    ),
    globals: {
        backgrounds: {
            value: "dark"
        }
    },
};
