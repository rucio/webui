import { cn } from '@/component-library/utils';

interface ProgressBarProps {
    className?: string;
    percentage: number;
}

export default function ProgressBar({ className, percentage }: ProgressBarProps) {
    const validPercentage = Math.min(Math.max(percentage, 0), 100);

    const progressBarClasses = `rounded-full h-2.5 w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-900 border-opacity-10 dark:border-none`;
    const progressClasses = `h-2.5 rounded-full bg-base-success-500 bg-opacity-80 dark:bg-opacity-60`;

    return (
        <div className={cn(progressBarClasses, className)}>
            <div className={progressClasses} style={{ width: `${validPercentage}%` }} />
        </div>
    );
}
