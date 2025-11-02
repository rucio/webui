import type { Meta, StoryObj } from '@storybook/react';
import { HotBarWidget } from './HotBarWidget';

const meta = {
    title: 'Dashboard/Widgets/HotBarWidget',
    component: HotBarWidget,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof HotBarWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state showing the HotBar widget.
 * The widget manages its own state and persists bookmarks to localStorage.
 */
export const Default: Story = {
    args: {},
};

/**
 * The HotBar widget allows users to:
 * - Add up to 5 bookmarks
 * - Edit existing bookmarks
 * - Delete bookmarks
 * - Click bookmarks to navigate
 * - Auto-detect bookmark type from URL
 */
export const WithInstructions: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: `
### Features
- **Local Storage**: Bookmarks are persisted in browser localStorage
- **Type Detection**: Automatically infers bookmark type from URL path
- **Validation**: Ensures URLs are same-host and required fields are filled
- **Responsive**: Adapts to mobile (1 col), tablet (2 cols), desktop (3 cols)
- **Accessible**: Full keyboard navigation and WCAG AAA contrast

### Usage
1. Click "Add Card" to create a new bookmark
2. Enter title (required), description (optional), and URL (required)
3. URL must be from the same host (e.g., /did/page/scope:name)
4. Type is auto-detected from URL pattern
5. Maximum 5 bookmarks allowed
                `,
            },
        },
    },
};
