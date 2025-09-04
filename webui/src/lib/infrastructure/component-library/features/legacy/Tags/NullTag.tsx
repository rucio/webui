import { twMerge } from 'tailwind-merge';

export const NullTag: React.FC<JSX.IntrinsicElements['span']> = ({ ...props }) => {
    const { className, ...otherprops } = props;
    return (
        <span
            className={twMerge(
                'bg-neutral-200 text-text-500 dark:bg-neutral-700 dark:text-text-400',
                'border-0 dark:border border-neutral-400',
                'h-6 rounded flex justify-center items-center w-16',
                className ?? '',
            )}
            {...otherprops}
        >
            null
        </span>
    );
};
