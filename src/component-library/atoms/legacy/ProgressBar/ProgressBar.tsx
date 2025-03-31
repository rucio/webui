import { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

export const ProgressBar: React.FC<
    JSX.IntrinsicElements['div'] & {
        percentage: number;
        colour?: string;
    }
> = ({ percentage, colour, ...props }) => {
    const { className, ...otherprops } = props;
    return (
        <div className={twMerge('rounded-full h-2.5 w-full', 'dark:bg-neutral-700 bg-neutral-200')}>
            <div className={twMerge(colour ?? 'bg-brand-600 dark:bg-brand-500', 'h-2.5 rounded-full')} style={{ width: `${percentage}%` }} />
        </div>
    );
};
