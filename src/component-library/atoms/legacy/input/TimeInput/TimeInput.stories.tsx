import type { Meta, StoryObj } from '@storybook/react';
import { TimeInput } from './TimeInput';
import { useState } from 'react';

const meta = {
    title: 'Components/Legacy/Input/TimeInput',
    component: TimeInput,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A time input component that follows the Rucio WebUI design system. Supports both 12-hour and 24-hour formats with optional seconds.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        onchange: { action: 'time changed' },
        initialtime: { control: 'text', description: 'Initial time value in HH:MM:SS format' },
        disabled: { control: 'boolean' },
        placeholder: { control: 'text' },
        showSeconds: { control: 'boolean', description: 'Whether to show seconds input' },
    },
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Select time',
        showSeconds: true,
        onchange: (time: string) => console.log('Time changed:', time),
    },
};

export const WithInitialTime: Story = {
    args: {
        initialtime: '14:30:00',
        showSeconds: true,
        onchange: (time: string) => console.log('Time changed:', time),
    },
};

export const WithoutSeconds: Story = {
    args: {
        placeholder: 'Select time',
        showSeconds: false,
        onchange: (time: string) => console.log('Time changed:', time),
    },
};

export const Disabled: Story = {
    args: {
        initialtime: '09:00:00',
        disabled: true,
        showSeconds: true,
        onchange: (time: string) => console.log('Time changed:', time),
    },
};

export const Interactive: Story = {
    args: {
        onchange: (time: string) => console.log('Time changed:', time),
    },
    render: () => {
        const [time, setTime] = useState<string>('12:00:00');

        return (
            <div className="w-80 space-y-4">
                <TimeInput
                    onchange={(newTime) => setTime(newTime)}
                    initialtime={time}
                    showSeconds={true}
                />
                <div className="text-sm text-neutral-700 dark:text-neutral-300">
                    Selected time: <strong>{time || 'None'}</strong>
                </div>
            </div>
        );
    },
};

export const DarkMode: Story = {
    args: {
        initialtime: '18:45:30',
        showSeconds: true,
        onchange: (time: string) => console.log('Time changed:', time),
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div className="dark">
                <Story />
            </div>
        ),
    ],
};

export const InForm: Story = {
    args: {
        onchange: (time: string) => console.log('Time changed:', time),
    },
    render: () => {
        const [startTime, setStartTime] = useState<string>('09:00:00');
        const [endTime, setEndTime] = useState<string>('17:00:00');

        return (
            <div className="w-96 p-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4">
                <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                        Start Time
                    </label>
                    <TimeInput
                        onchange={setStartTime}
                        initialtime={startTime}
                        showSeconds={false}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                        End Time
                    </label>
                    <TimeInput
                        onchange={setEndTime}
                        initialtime={endTime}
                        showSeconds={false}
                    />
                </div>
                <div className="text-sm text-neutral-700 dark:text-neutral-300 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    Working hours: <strong>{startTime}</strong> to <strong>{endTime}</strong>
                </div>
            </div>
        );
    },
};
