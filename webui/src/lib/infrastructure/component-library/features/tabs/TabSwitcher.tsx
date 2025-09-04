import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { cn } from '@/component-library/utils';

type TabSwitcherProps = {
    tabNames: string[];
    onSwitch: (index: number) => void;
    activeIndex: number;
};

export const TabSwitcher = ({ tabNames, onSwitch, activeIndex }: TabSwitcherProps) => {
    const regularTabClasses = 'cursor-pointer flex flex-1 items-center justify-center py-1 px-2 text-neutral-600 dark:text-neutral-400';
    const activeTabClasses = cn(
        'rounded',
        'text-neutral-900 dark:text-neutral-100 whitespace-nowrap',
        'bg-neutral-200 dark:bg-neutral-700',
        'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
    );

    return (
        <KeyValueWrapper className="flex flex-row w-full gap-x-2 p-1">
            {tabNames.map((name, index) => {
                const isActive = index === activeIndex;
                const tabClasses = cn(regularTabClasses, { [activeTabClasses]: isActive });
                return (
                    <div onClick={() => onSwitch(index)} key={name} className={tabClasses}>
                        {name}
                    </div>
                );
            })}
        </KeyValueWrapper>
    );
};
