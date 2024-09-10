import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export const SubPage: React.FC<
    JSX.IntrinsicElements['div'] & {
        show: boolean;
        run?: () => void; // to run when shown
    }
> = ({ show = false, run, ...props }) => {
    const { className, children, ...otherprops } = props;
    useEffect(() => {
        if (show && run) {
            run();
        }
    }, [show]);
    return (
        <div className={twMerge(show ? 'block' : 'hidden', 'grow rounded-b-md', className)} {...props}>
            {children}
        </div>
    );
};
