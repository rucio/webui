import type { Meta, StoryObj } from '@storybook/nextjs';
import { DateWithTooltip } from './DateWithTooltip';

const meta: Meta<typeof DateWithTooltip> = {
    title: 'Features/Utils/DateWithTooltip',
    component: DateWithTooltip,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Renders a short `YYYY/MM/DD` date (UTC) as visible text. Hovering or focusing the element reveals a tooltip with the full `YYYY/MM/DD HH:MM:SS UTC` datetime. Handles `null`/`undefined` inputs gracefully by showing "N/A".',
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        Story => (
            <div className="p-8 min-w-[200px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof DateWithTooltip>;

// ─────────────────────────────────────────────
// Basic cases
// ─────────────────────────────────────────────

/** ISO 8601 string input — the most common usage from API responses. */
export const ISOString: Story = {
    args: {
        date: '2024-01-15T14:32:05Z',
    },
};

/** Native `Date` object input. */
export const DateObject: Story = {
    args: {
        date: new Date('2024-06-30T08:00:00Z'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Accepts a native `Date` object in addition to ISO strings.',
            },
        },
    },
};

/** `null` input — renders "N/A" with muted styling, no interactive tooltip. */
export const NullDate: Story = {
    args: {
        date: null,
    },
    parameters: {
        docs: {
            description: {
                story: 'When `date` is `null`, the component renders a muted "N/A" placeholder without a tooltip.',
            },
        },
    },
};

/** `undefined` input — same fallback behaviour as `null`. */
export const UndefinedDate: Story = {
    args: {
        date: undefined,
    },
    parameters: {
        docs: {
            description: {
                story: 'When `date` is `undefined`, the component renders a muted "N/A" placeholder without a tooltip.',
            },
        },
    },
};

/** Invalid / malformed string — renders "N/A". */
export const InvalidDate: Story = {
    args: {
        date: 'not-a-date',
    },
    parameters: {
        docs: {
            description: {
                story: 'Malformed date strings result in "N/A" with no tooltip.',
            },
        },
    },
};

// ─────────────────────────────────────────────
// Interaction: hover to reveal tooltip
// ─────────────────────────────────────────────

/**
 * Hover over the date text to see the full UTC datetime tooltip.
 * The tooltip stays open as the pointer moves from the trigger into the content.
 */
export const HoverToShowTooltip: Story = {
    args: {
        date: '2024-03-21T23:59:59Z',
    },
    parameters: {
        docs: {
            description: {
                story:
                    'Hover (or focus via keyboard Tab) over the date to reveal the full timestamp tooltip. The tooltip remains open while the pointer is over either the trigger or the popover content.',
            },
        },
    },
};

// ─────────────────────────────────────────────
// UTC / timezone edge cases
// ─────────────────────────────────────────────

/** A timestamp right at midnight UTC — display date should match tooltip date. */
export const MidnightUTC: Story = {
    args: {
        date: '2024-07-04T00:00:00Z',
    },
    parameters: {
        docs: {
            description: {
                story: 'Midnight UTC — the short date and the tooltip date should agree regardless of the viewer\'s local timezone.',
            },
        },
    },
};

// ─────────────────────────────────────────────
// Dark mode
// ─────────────────────────────────────────────

export const DarkMode: Story = {
    args: {
        date: '2024-01-15T14:32:05Z',
    },
    decorators: [
        Story => (
            <div className="dark p-8 rounded-lg bg-neutral-900">
                <Story />
            </div>
        ),
    ],
    globals: {
        backgrounds: {
            value: 'dark',
        },
    },
};

// ─────────────────────────────────────────────
// Side-by-side showcase
// ─────────────────────────────────────────────

export const AllVariations: Story = {
    render: () => (
        <div className="space-y-4 p-8">
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">ISO string</span>
                <DateWithTooltip date="2024-01-15T14:32:05Z" />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Date object</span>
                <DateWithTooltip date={new Date('2024-06-30T08:00:00Z')} />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">null</span>
                <DateWithTooltip date={null} />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">undefined</span>
                <DateWithTooltip date={undefined} />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Invalid string</span>
                <DateWithTooltip date="not-a-date" />
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'All input variations side-by-side. Hover each valid date to see the full UTC tooltip.',
            },
        },
    },
};
