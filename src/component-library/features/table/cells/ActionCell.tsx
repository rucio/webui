import React from 'react';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { Button, ButtonProps } from '@/component-library/atoms/form/button';

export interface ActionCellButton {
    label: string;
    icon?: 'delete' | 'edit';
    /** Button colour; defaults to neutral. Use success for confirm, error for destructive actions. */
    variant?: NonNullable<ButtonProps['variant']>;
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

                return (
                    <Button
                        key={action.label}
                        type="button"
                        size="sm"
                        variant={action.variant ?? 'neutral'}
                        onClick={e => {
                            e.stopPropagation();
                            action.onClick();
                        }}
                        disabled={action.disabled}
                        className="h-7 px-2 text-xs"
                        aria-label={action.label}
                        title={action.label}
                    >
                        {Icon && <Icon className="mr-1 h-3.5 w-3.5" aria-hidden="true" />}
                        {action.label}
                    </Button>
                );
            })}
        </div>
    );
};
