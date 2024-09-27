import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { RSEAccountUsageViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { HiExternalLink } from 'react-icons/hi';
import Link from 'next/link';
import { Field } from '@/component-library/atoms/misc/Field';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import CustomLegend, { LegendOption } from '@/component-library/pages/Dashboard/widgets/CustomLegend';
import useDarkMode from '@/lib/infrastructure/hooks/useDarkMode';

const CustomTooltip = ({ active, payload, totalBytes }: any) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0];
        const percentage = ((value / totalBytes) * 100).toFixed(2);
        return (
            <KeyValueWrapper className="p-3 text-neutral-900 dark:text-neutral-100">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">{name}</p>
                <p>
                    {formatFileSize(value)} ({percentage}%)
                </p>
            </KeyValueWrapper>
        );
    }
    return null;
};

const UsagePieChart = ({ usage }: { usage: RSEAccountUsageViewModel }) => {
    const COLORS = [
        // Used
        'rgba(239,68,68,0.8)', // Tailwind base-success-500
        // Remaining
        'rgba(34,197,94,0.8)', // Tailwind base-error-500
    ];

    const isDarkMode = useDarkMode();
    // Tailwind neutral-100 or neutral-900
    const borderColor = isDarkMode ? 'rgba(241,245,249,0.15)' : 'rgba(15,23,42,0.15)';

    const { rse, used_bytes, bytes_limit } = usage;
    const remainingBytes = bytes_limit - used_bytes;

    const pieData = [
        { name: 'Used', value: used_bytes },
        { name: 'Remaining', value: remainingBytes > 0 ? remainingBytes : 0 },
    ];

    return (
        <div className="flex flex-col justify-center h-fit w-full mx-3 my-5 overflow-hidden">
            <Link
                href={`/rse/page/${rse}`}
                className="flex space-x-2 justify-center items-center text-neutral-900 dark:text-neutral-100 hover:text-brand-500 dark:hover:text-brand-500 font-medium"
            >
                <HiExternalLink className="flex-shrink-0" />
                <span className="truncate">{rse}</span>
            </Link>
            <ResponsiveContainer height={275}>
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" stroke={borderColor}>
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none" />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip totalBytes={bytes_limit} />} />
                </PieChart>
            </ResponsiveContainer>
            <div className="w-full flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Quota</span>
                    <Field>{formatFileSize(bytes_limit)}</Field>
                </div>
            </div>
        </div>
    );
};

const legendOptions: LegendOption[] = [
    { label: 'Used', color: 'bg-base-error-500' },
    { label: 'Remaining', color: 'bg-base-success-500' },
];

interface TopStorageUsageWidgetProps {
    usages?: RSEAccountUsageViewModel[];
    isLoading: boolean;
    errorMessage?: string;
}

export const TopStorageUsageWidget = ({ usages, isLoading, errorMessage }: TopStorageUsageWidgetProps) => {
    // Take top 10 RSEs with most usage
    const displayedUsages = usages?.sort((a, b) => b.used_bytes - a.used_bytes).slice(0, 10);

    const hasUsages = displayedUsages && displayedUsages.length !== 0;
    const isResultEmpty = !hasUsages && !errorMessage && !isLoading;

    const getCharts = () => {
        return (
            <div className="flex flex-wrap justify-center gap-4 w-full h-full">
                {displayedUsages?.map(usage => {
                    return (
                        <div key={usage.rse_id} className="flex justify-center items-center flex-1 min-w-[300px]">
                            <UsagePieChart usage={usage} />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <KeyValueWrapper className="w-full p-5 overflow-x-auto space-y-2">
            <Heading text="RSE Usage" size="md" />
            {hasUsages && <CustomLegend legendOptions={legendOptions} />}
            <div className="flex min-w-[700px] h-[740px] items-center justify-center">
                {isResultEmpty && (
                    <InfoField>
                        <span>No RSEs with quota</span>
                    </InfoField>
                )}
                {errorMessage && (
                    <WarningField>
                        <span>{errorMessage}</span>
                    </WarningField>
                )}
                {hasUsages && getCharts()}
                {isLoading && <LoadingSpinner />}
            </div>
        </KeyValueWrapper>
    );
};
