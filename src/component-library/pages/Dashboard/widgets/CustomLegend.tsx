import React from 'react';
import cn from 'classnames';
import CircleWithText from '@/component-library/atoms/misc/CircleWithText';

export type LegendOption = {
    label: string;
    color: string;
};

interface CustomLegendProps {
    legendOptions: LegendOption[];
}

const CustomLegend: React.FC<CustomLegendProps> = ({ legendOptions }) => {
    const commonCircleClasses = 'bg-opacity-70 h-6 w-6';

    return (
        <div className="flex justify-center space-x-10 text-sm text-neutral-900 dark:text-neutral-100">
            {legendOptions.map((option, index) => (
                <div key={index} className="flex space-x-2 items-center">
                    <CircleWithText text="" className={cn(commonCircleClasses, option.color)} />
                    <span>{option.label}</span>
                </div>
            ))}
        </div>
    );
};

export default CustomLegend;
