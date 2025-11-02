import type { Meta, StoryObj } from '@storybook/react';
import { CommandPalette } from './CommandPalette';
import { CommandPaletteProvider } from '@/lib/infrastructure/hooks/useCommandPalette';

/**
 * Command Palette Component
 *
 * Global search and navigation palette with keyboard shortcuts.
 * Opens with Cmd/Ctrl + K and provides quick access to:
 * - Recent pages
 * - Bookmarks
 * - Navigation shortcuts
 * - Smart search actions
 * - Help resources
 */
const meta = {
    title: 'Features/Command Palette',
    component: CommandPalette,
    decorators: [
        Story => (
            <CommandPaletteProvider>
                <div className="min-h-screen bg-neutral-0 dark:bg-neutral-900">
                    <Story />
                    <div className="p-8">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Press{' '}
                            <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded">
                                Cmd/Ctrl + K
                            </kbd>{' '}
                            to open the command palette.
                        </p>
                    </div>
                </div>
            </CommandPaletteProvider>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'A global command palette for quick navigation and search. Features smart search detection, keyboard navigation, and integration with recent pages and bookmarks.',
            },
        },
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state of the command palette.
 * Shows all available sections when opened with no search query.
 */
export const Default: Story = {
    args: {
        open: true,
        onOpenChange: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'The default state shows all available commands grouped into sections: Recent, Bookmarks, Navigation, Actions, and Help.',
            },
        },
    },
};

/**
 * Command palette in closed state.
 * This is the initial state before user interaction.
 */
export const Closed: Story = {
    args: {
        open: false,
        onOpenChange: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'The closed state. Press Cmd/Ctrl + K to open the palette.',
            },
        },
    },
};

/**
 * Command palette in dark mode.
 * All design tokens automatically adapt to dark theme.
 */
export const DarkMode: Story = {
    args: {
        open: true,
        onOpenChange: () => {},
    },
    parameters: {
        backgrounds: { default: 'dark' },
        docs: {
            description: {
                story: 'The command palette in dark mode with proper contrast and color adaptation.',
            },
        },
    },
    decorators: [
        Story => (
            <div className="dark">
                <Story />
            </div>
        ),
    ],
};

/**
 * Interactive demo showing keyboard navigation.
 * Use arrow keys to navigate, Enter to select, Escape to close.
 */
export const KeyboardNavigation: Story = {
    args: {
        open: true,
        onOpenChange: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates keyboard navigation:\n- ↓/↑ arrows to navigate items\n- Enter to select\n- Escape to close\n- Cmd/Ctrl + K to toggle',
            },
        },
    },
};

/**
 * Command palette with light theme focused on motion.
 * Shows the fade + scale animation on open/close.
 */
export const WithMotion: Story = {
    args: {
        open: true,
        onOpenChange: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'The command palette uses Framer Motion for smooth animations. Open/close transitions use fade and scale effects with 200ms duration.',
            },
        },
    },
};
