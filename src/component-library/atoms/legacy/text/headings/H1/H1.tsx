import { twMerge } from 'tailwind-merge';
export const H1: React.FC<JSX.IntrinsicElements['h1']> = ({ ...props }) => {
    const { children, className, ...otherprops } = props;
    return (
        <h1 className={twMerge('text-4xl font-extrabold leading-none dark:text-text-0 text-text-1000', className ?? '')} {...otherprops}>
            {children}
        </h1>
    );
};
