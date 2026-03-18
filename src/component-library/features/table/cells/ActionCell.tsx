import React from 'react';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { cn } from '@/component-library/utils';

export interface ActionCellButton {
    label: string;
    icon?: 'delete' | 'edit';
    variant?: 'default' | 'error';
    onClick: () => void;
    disabled?: boolean;
}

export interface ActionCellProps {
    actions: ActionCellButton[];
}

const iconMap = {
    delete: HiOutlineTrash,
    edit: HiOutlinePencil,
};

const variantClasses = {
    default: cn(
        'text-neutral-600 dark:text-neutral-400',
        'hover:text-brand-600 dark:hover:text-brand-400',
        'hover:bg-brand-100 dark:hover:bg-brand-900/30',
    ),
    error: cn(
        'text-neutral-600 dark:text-neutral-400',
        'hover:text-base-error-600 dark:hover:text-base-error-400',
        'hover:bg-base-error-100 dark:hover:bg-base-error-900/30',
    ),
};

/**
 * A table cell renderer that displays action buttons for row-level operations.
 * Designed for use with AG-Grid as a custom cell renderer.
 *
 * @example
 * ```tsx
 * // AG-Grid column definition
 * {
 *     headerName: 'Actions',
 *     cellRenderer: (params) => (
 *         <ActionCell actions={[
 *             { label: 'Delete', icon: 'delete', variant: 'error', onClick: () => handleDelete(params.data) },
 *         ]} />
 *     ),
 * }
 * ```
 */
export const ActionCell: React.FC<ActionCellProps> = ({ actions }) => {
    return (
        <div className="flex items-center gap-1 h-full">
            {actions.map(action => {
                const Icon = action.icon ? iconMap[action.icon] : null;
                const variant = action.variant || 'default';

                return (
                    <button
                        key={action.label}
                        type="button"
                        onClick={e => {
                            e.stopPropagation();
                            action.onClick();
                        }}
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                action.onClick();
                            }
                        }}
                        disabled={action.disabled}
                        className={cn(
                            'inline-flex items-center gap-1',
                            'rounded px-2 py-1',
                            'text-xs font-medium',
                            'transition-colors duration-150',
                            'focus:outline-none focus:ring-2 focus:ring-brand-500',
                            'disabled:opacity-50 disabled:pointer-events-none',
                            variantClasses[variant],
                        )}
                        aria-label={action.label}
                        title={action.label}
                    >
                        {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                        <span>{action.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
