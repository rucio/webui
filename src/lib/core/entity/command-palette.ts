/**
 * Command Palette Entity Types
 * Defines the structure for command palette items and sections
 */

/**
 * Command item types for categorization
 */
export type CommandType = 'recent' | 'bookmark' | 'navigation' | 'action' | 'help';

/**
 * Individual command item in the palette
 */
export interface CommandItem {
    /** Unique identifier for the command */
    id: string;

    /** Type of command for grouping */
    type: CommandType;

    /** Display title */
    title: string;

    /** Optional description/subtitle */
    description?: string;

    /** Icon component (Heroicons) */
    icon?: React.ComponentType<{ className?: string }>;

    /** URL to navigate to (if applicable) */
    url?: string;

    /** Custom action handler (executed instead of navigation if provided) */
    onSelect?: () => void;

    /** Optional badge text (e.g., "External", "DID", "RSE") */
    badge?: string;

    /** Search keywords for filtering */
    keywords?: string[];

    /** Optional keyboard shortcut to display */
    shortcut?: string;
}

/**
 * Grouped section of command items
 */
export interface CommandSection {
    /** Unique identifier for the section */
    id: string;

    /** Section title/label */
    title: string;

    /** Items in this section */
    items: CommandItem[];

    /** Optional icon for the section header */
    icon?: React.ComponentType<{ className?: string }>;
}
