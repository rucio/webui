import * as React from 'react';

export interface FormFieldProps {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: React.ReactNode;
}

/** Space-separated ids of the hint and error nodes rendered by FormField, for aria-describedby. */
export const describedBy = (id: string, state: { error?: string | boolean; hint?: string | boolean }): string | undefined => {
    const ids = [state.hint ? `${id}-hint` : null, state.error ? `${id}-error` : null].filter(Boolean);
    return ids.length > 0 ? ids.join(' ') : undefined;
};

/** Label, control, optional hint and inline error. The control sets aria-describedby via `describedBy`. */
export const FormField: React.FC<FormFieldProps> = ({ id, label, required, error, hint, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            {label} {required && <span className="text-base-error-600">*</span>}
        </label>
        {children}
        {hint && (
            <p id={`${id}-hint`} className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {hint}
            </p>
        )}
        {error && (
            <p id={`${id}-error`} className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">
                {error}
            </p>
        )}
    </div>
);

/** Native select styled like the Input atom; keeps dialogs simple and fully keyboard and test friendly. */
export const selectClassName = [
    'flex w-full h-10 rounded-md border px-3 py-2',
    'border-neutral-900/10 dark:border-neutral-100/10',
    'bg-neutral-100 dark:bg-neutral-800',
    'text-neutral-900 dark:text-neutral-100',
    'focus:outline-hidden focus:border-brand-500 focus:shadow-brand',
    'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ');
