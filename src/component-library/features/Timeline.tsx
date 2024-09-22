import React from 'react';
import { cn } from '@/component-library/utils';
import CircleWithText from '@/component-library/atoms/misc/CircleWithText';
import { Divider } from '@/component-library/atoms/misc/Divider';

interface TimelineProps {
    steps: string[];
    activeIndex: number;
    onSwitch: (idx: number) => void;
}

const Timeline = ({ steps, activeIndex, onSwitch }: TimelineProps) => {
    return (
        <div className="flex flex-row justify-between items-center overflow-x-auto">
            {steps.map((step, index) => {
                const indexStr = (index + 1).toString();
                let color: string;
                if (index === activeIndex) {
                    color = 'bg-brand-500';
                } else if (index < activeIndex) {
                    color = 'bg-base-success-500';
                } else {
                    color = 'bg-neutral-0 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100';
                }

                const switchActive = () => onSwitch(index);

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-row items-center space-x-2">
                            <CircleWithText
                                className={cn('bg-opacity-80 font-semibold', color)}
                                text={indexStr}
                                onClick={index < activeIndex ? switchActive : undefined}
                            />
                            <span className="text-neutral-900 dark:text-neutral-100 hidden md:inline">{step}</span>
                        </div>
                        {index < steps.length - 1 && <Divider className="height-fit mx-3" color="bg-neutral-300 dark:bg-neutral-700" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Timeline;
