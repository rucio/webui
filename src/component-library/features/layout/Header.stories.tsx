import type { Meta, StoryObj } from '@storybook/nextjs';
import { Header } from './Header';
import { Role, User } from '@/lib/core/entity/auth-models';

const meta: Meta<typeof Header> = {
    title: 'Features/Layout/Header',
    component: Header,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

const getMockUser = (accountName: string): User => ({
    rucioIdentity: 'mock-identity',
    rucioAccount: accountName,
    rucioVO: 'mock-vo',
    role: Role.USER,
    country: 'Switzerland',
});

const mockSiteHeader = {
    status: 'success' as const,
    activeAccount: getMockUser('jdoe'),
    availableAccounts: [getMockUser('jdoe')],
    homeUrl: 'https://rucio.cern.ch',
    projectUrl: 'https://home.cern',
};

// Basic states
export const Default: Story = {
    args: {
        siteHeader: mockSiteHeader,
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

export const SingleAccount: Story = {
    args: {
        siteHeader: {
            ...mockSiteHeader,
            activeAccount: getMockUser('alice'),
            availableAccounts: [getMockUser('alice')],
        },
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

export const MultipleAccounts: Story = {
    args: {
        siteHeader: {
            ...mockSiteHeader,
            activeAccount: getMockUser('alice'),
            availableAccounts: [
                getMockUser('alice'),
                getMockUser('bob'),
                getMockUser('charlie'),
                getMockUser('diana'),
            ],
        },
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

export const Loading: Story = {
    args: {
        siteHeader: undefined,
        siteHeaderError: null,
        isSiteHeaderFetching: true,
    },
};

export const Error: Story = {
    args: {
        siteHeader: undefined,
        siteHeaderError: new globalThis.Error('Failed to fetch header data'),
        isSiteHeaderFetching: false,
    },
};

// With main content to demonstrate skip link
export const WithMainContent: Story = {
    render: (args) => (
        <div>
            <Header {...args} />
            <main id="main-content" tabIndex={-1} className="p-8">
                <h1 className="text-3xl font-bold mb-4">Main Content</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Press <kbd className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded text-sm">Tab</kbd> key to
                    reveal the "Skip to main content" link at the top of the page.
                </p>
                <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Accessibility Feature</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        The skip link allows keyboard users to bypass the navigation and jump directly to the main content.
                    </p>
                </div>
            </main>
        </div>
    ),
    args: {
        siteHeader: mockSiteHeader,
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

// Mobile viewport
export const Mobile: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    args: {
        siteHeader: mockSiteHeader,
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

export const MobileWithMenu: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    render: (args) => (
        <div>
            <Header {...args} />
            <div className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
                <p>Click the hamburger menu icon (☰) to open the mobile navigation.</p>
                <p className="mt-2">The mobile menu features:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Full-screen overlay</li>
                    <li>Close button (X)</li>
                    <li>Search bar integration</li>
                    <li>Vertical navigation links</li>
                </ul>
            </div>
        </div>
    ),
    args: {
        siteHeader: mockSiteHeader,
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

// Tablet viewport
export const Tablet: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
    args: {
        siteHeader: mockSiteHeader,
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

// Dark mode
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: (args) => (
        <div className="dark bg-neutral-900 min-h-screen">
            <Header {...args} />
            <main className="p-8">
                <h1 className="text-3xl font-bold text-neutral-100 mb-4">Dark Mode</h1>
                <p className="text-neutral-400">Header with dark mode styling</p>
            </main>
        </div>
    ),
    args: {
        siteHeader: mockSiteHeader,
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

// Full page example
export const FullPageLayout: Story = {
    render: (args) => (
        <div className="min-h-screen flex flex-col">
            <Header {...args} />
            <main id="main-content" tabIndex={-1} className="flex-1 p-8">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                    Full page layout demonstrating header integration
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                            <h3 className="font-semibold mb-2">Card {i}</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Dashboard content</p>
                        </div>
                    ))}
                </div>

                <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Data Table</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Table content would go here</p>
                </div>
            </main>
        </div>
    ),
    args: {
        siteHeader: mockSiteHeader,
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

// Responsive behavior demonstration
export const ResponsiveBehavior: Story = {
    render: (args) => (
        <div>
            <Header {...args} />
            <main className="p-8">
                <h1 className="text-3xl font-bold mb-4">Responsive Behavior</h1>
                <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Breakpoints</h2>
                    <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <li>• Mobile ({"<"}975px): Hamburger menu with full-screen overlay</li>
                        <li>• Desktop (≥975px): Horizontal navigation bar with dropdown menus</li>
                        <li>• Search bar: Hidden on mobile ({"<"}768px), visible on tablet+ (≥768px)</li>
                    </ul>

                    <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded">
                        <p className="text-sm font-medium mb-2">Try it:</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Resize your browser window to see the navigation adapt between mobile and desktop layouts.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    ),
    args: {
        siteHeader: mockSiteHeader,
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

// Accessibility features
export const AccessibilityFeatures: Story = {
    render: (args) => (
        <div>
            <Header {...args} />
            <main id="main-content" tabIndex={-1} className="p-8">
                <h1 className="text-3xl font-bold mb-6">Accessibility Features</h1>

                <div className="space-y-6">
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Skip to Main Content</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                            Press <kbd className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded text-xs">Tab</kbd> to
                            reveal the skip link that allows keyboard users to bypass navigation.
                        </p>
                    </div>

                    <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">ARIA Attributes</h2>
                        <ul className="list-disc ml-6 text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                            <li>
                                <code>role="banner"</code> on header element
                            </li>
                            <li>
                                <code>aria-label="Main navigation"</code> on nav element
                            </li>
                            <li>
                                <code>aria-expanded</code> on mobile menu button
                            </li>
                            <li>
                                <code>aria-controls</code> linking button to menu
                            </li>
                            <li>
                                <code>role="dialog"</code> and <code>aria-modal="true"</code> on mobile overlay
                            </li>
                            <li>
                                <code>aria-hidden="true"</code> on decorative icons
                            </li>
                        </ul>
                    </div>

                    <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Keyboard Navigation</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            All interactive elements are keyboard accessible via Tab, Shift+Tab, and Enter keys.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    ),
    args: {
        siteHeader: mockSiteHeader,
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};
