import { twMerge } from 'tailwind-merge';

type BodyProps = JSX.IntrinsicElements['div'];

export const Body: React.FC<BodyProps> = ({ ...props }) => {
    const { children, className, ...otherprops } = props;
    return (
        <div
            className={twMerge(
                'flex flex-col space-y-2',
                'rounded-md p-2 border',
                'dark:border-2 dark:border-neutral-0',
                'bg-neutral-0 dark:bg-neutral-800',
                className ?? '',
            )}
            {...otherprops}
        >
            {children}
        </div>
    );
};
