import type { Meta, StoryObj } from '@storybook/nextjs';
import { ActionCell } from './ActionCell';

const meta: Meta<typeof ActionCell> = {
    title: 'Components/Table/ActionCell',
    component: ActionCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActionCell>;

export const SingleDeleteAction: Story = {
    args: {
        actions: [{ label: 'Delete', icon: 'delete', variant: 'error', onClick: () => alert('Delete clicked!') }],
    },
};

export const SingleEditAction: Story = {
    args: {
        actions: [{ label: 'Edit', icon: 'edit', variant: 'default', onClick: () => alert('Edit clicked!') }],
    },
};

export const MultipleActions: Story = {
    args: {
        actions: [
            { label: 'Edit', icon: 'edit', variant: 'default', onClick: () => alert('Edit clicked!') },
            { label: 'Delete', icon: 'delete', variant: 'error', onClick: () => alert('Delete clicked!') },
        ],
    },
};

export const DisabledAction: Story = {
    args: {
        actions: [
            { label: 'Edit', icon: 'edit', variant: 'default', onClick: () => {}, disabled: true },
            { label: 'Delete', icon: 'delete', variant: 'error', onClick: () => alert('Delete clicked!') },
        ],
    },
};

export const InTableContext: Story = {
    render: () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">RSE Attributes Table</h3>
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                <thead className="bg-neutral-100 dark:bg-neutral-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">Key</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-neutral-0 dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {[
                        { key: 'fts', value: 'https://fts3.cern.ch:8446' },
                        { key: 'site', value: 'CERN' },
                        { key: 'tier', value: '0' },
                    ].map(attr => (
                        <tr key={attr.key}>
                            <td className="px-6 py-4 text-sm font-mono text-neutral-900 dark:text-neutral-100">{attr.key}</td>
                            <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300">{attr.value}</td>
                            <td className="px-6 py-4">
                                <ActionCell
                                    actions={[
                                        {
                                            label: 'Delete',
                                            icon: 'delete',
                                            variant: 'error',
                                            onClick: () => alert(`Delete ${attr.key}`),
                                        },
                                    ]}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ),
};

export const DarkMode: Story = {
    render: () => (
        <div className="dark p-4 bg-neutral-900 rounded-lg">
            <div className="flex gap-8">
                <div>
                    <p className="text-xs text-neutral-400 mb-2">Default</p>
                    <ActionCell actions={[{ label: 'Edit', icon: 'edit', variant: 'default', onClick: () => {} }]} />
                </div>
                <div>
                    <p className="text-xs text-neutral-400 mb-2">Error</p>
                    <ActionCell actions={[{ label: 'Delete', icon: 'delete', variant: 'error', onClick: () => {} }]} />
                </div>
                <div>
                    <p className="text-xs text-neutral-400 mb-2">Multiple</p>
                    <ActionCell
                        actions={[
                            { label: 'Edit', icon: 'edit', variant: 'default', onClick: () => {} },
                            { label: 'Delete', icon: 'delete', variant: 'error', onClick: () => {} },
                        ]}
                    />
                </div>
            </div>
        </div>
    ),
    globals: {
        backgrounds: {
            value: "dark"
        }
    },
};
