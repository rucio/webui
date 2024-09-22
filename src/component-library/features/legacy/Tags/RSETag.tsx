import { RSEBlockState } from '@/lib/core/entity/rucio';
import { twMerge } from 'tailwind-merge';
import { RSEBlockTag } from './RSEBlockTag';

export const RSETag: React.FC<JSX.IntrinsicElements['span'] & { blocked: RSEBlockState }> = ({ blocked, ...props }) => {
    const { className, ...otherprops } = props;
    const [mayread, maywrite, maydelete] = [Boolean(blocked & 1), Boolean(blocked & 2), Boolean(blocked & 4)];
    return (
        <span className={twMerge('flex flex-row space-x-1 flex-wrap break-all')} {...otherprops}>
            {otherprops.children}
            <RSEBlockTag className={twMerge(mayread ? 'flex' : 'hidden')} block="Read" />
            <RSEBlockTag className={twMerge(maywrite ? 'flex' : 'hidden')} block="Write" />
            <RSEBlockTag className={twMerge(maydelete ? 'flex' : 'hidden')} block="Delete" />
        </span>
    );
};
