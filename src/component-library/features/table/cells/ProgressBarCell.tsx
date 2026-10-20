import { ProgressBar } from '@/component-library/atoms/misc/ProgressBar';

export type ProgressBarParams = {
    available: number,
    all: number,
    keyword: string,
    valueFormatter?: (value: number) => string,
};

export const ProgressBarCell = ({ available, all, keyword, valueFormatter }: ProgressBarParams) => {
    let percentage: number = 0;
    if (all > 0)
        percentage = (available / all) * 100;

    const getPercentageText = () => {
        const baseText = valueFormatter ? 
            `${valueFormatter(available)} ${keyword} out of ${valueFormatter(all)}`
            : `${available} ${keyword} out of ${all}`;
        
        return `${baseText}${all > 0 ? ` (${percentage.toFixed(2)}%)` : ''}`;
    };

    return (
        <div className="flex flex-col w-full h-full justify-center space-y-2">
            <ProgressBar percentage={percentage} />
            <span className="text-ellipsis text-sm text-neutral-900 dark:text-neutral-100">{getPercentageText()}</span>
        </div>
    );
};