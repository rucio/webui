import { twMerge } from 'tailwind-merge';

export const P: React.FC<JSX.IntrinsicElements['p'] & { mono?: boolean }> = ({ mono = false, ...props }) => {
    const { className, ...otherprops } = props;

    return (
        <p className={twMerge('dark:text-text-0 text-text-1000', mono ? 'font-mono' : '', className ?? '')} {...otherprops}>
            {props.children}
        </p>
    );
};
