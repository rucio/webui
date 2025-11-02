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
import { useTheme } from 'next-themes';
import { chartColors, getBorderColor } from '@/lib/utils/chart-colors';

const CustomTooltip = ({ active, payload, totalBytes }: any) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0];
        // -1 is internal representation of unlimited quota, so percentage is not applicable
        const percentage = totalBytes === -1 ? undefined : ((value / totalBytes) * 100).toFixed(2);
        return (
            <KeyValueWrapper className="p-3 text-neutral-900 dark:text-neutral-100">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">{name}</p>
                <p>
                    {formatFileSize(value)} {percentage && `(${percentage}%)`}
                </p>
            </KeyValueWrapper>
        );
    }
    return null;
};

const PIE_HEIGHT = 275;

const UsagePieChart = ({ usage }: { usage: RSEAccountUsageViewModel }) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    // Use design system colors via chart utility
    const COLORS = [
        chartColors.warning, // Used - Warning color indicates consumption
        chartColors.success, // Remaining - Success color indicates availability
    ];

    const borderColor = getBorderColor(isDarkMode);

    const { rse, used_bytes, bytes_limit } = usage;
    const remainingBytes = bytes_limit - used_bytes;

    // -1 is internal representation for unlimited quota
    const isInfiniteWithoutUsage = bytes_limit === -1 && used_bytes === 0;

    const pieData = [
        { name: 'Used', value: used_bytes },
        { name: 'Remaining', value: remainingBytes > 0 ? remainingBytes : 0 },
    ];

    return (
        <div className="flex flex-col justify-center h-fit w-full mx-3 my-5 overflow-hidden">
            <Link
                href={`/rse/list?expression=${rse}&autoSearch=true`}
                className="flex space-x-2 justify-center items-center text-neutral-900 dark:text-neutral-100 hover:text-brand-500 dark:hover:text-brand-500 font-medium"
            >
                <HiExternalLink className="flex-shrink-0" />
                <span className="truncate">{rse}</span>
            </Link>
            {isInfiniteWithoutUsage && (
                <div
                    className="flex justify-center items-center text-neutral-900 dark:text-neutral-100"
                    style={{
                        height: PIE_HEIGHT,
                    }}
                >
                    No usage
                </div>
            )}
            {!isInfiniteWithoutUsage && (
                <ResponsiveContainer height={PIE_HEIGHT}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" stroke={borderColor}>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip totalBytes={bytes_limit} />} />
                    </PieChart>
                </ResponsiveContainer>
            )}
            <div className="w-full flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Quota</span>
                    <Field>{bytes_limit === -1 ? 'Infinity' : formatFileSize(bytes_limit)}</Field>
                </div>
            </div>
        </div>
    );
};

const legendOptions: LegendOption[] = [
    { label: 'Used', color: 'bg-base-warning-500' },
    { label: 'Remaining', color: 'bg-base-success-500' },
];

interface TopStorageUsageWidgetProps {
    usages?: RSEAccountUsageViewModel[];
    isLoading: boolean;
    errorMessage?: string;
}

export const TopStorageUsageWidget = ({ usages, isLoading, errorMessage }: TopStorageUsageWidgetProps) => {
    // Separate RSEs with actual usage from empty ones
    const rsesWithUsage = usages?.filter(u => u.used_bytes > 0 || (u.bytes_limit !== -1 && u.bytes_limit > 0)) || [];
    const emptyRSEs = usages?.filter(u => u.used_bytes === 0 && u.bytes_limit === -1) || [];

    // Take top 10 RSEs with most usage
    const displayedUsages = rsesWithUsage.sort((a, b) => b.used_bytes - a.used_bytes).slice(0, 10);

    const hasUsages = displayedUsages.length > 0;
    const hasEmptyRSEs = emptyRSEs.length > 0;
    const isResultEmpty = !hasUsages && !hasEmptyRSEs && !errorMessage && !isLoading;

    const getCharts = () => {
        return (
            <div className="flex flex-wrap justify-center gap-4 w-full h-full">
                {displayedUsages.map(usage => {
                    return (
                        <div key={usage.rse_id} className="flex justify-center items-center flex-1 min-w-[300px]">
                            <UsagePieChart usage={usage} />
                        </div>
                    );
                })}
            </div>
        );
    };

    const getEmptyRSEsList = () => {
        if (emptyRSEs.length === 0) return null;

        return (
            <div className="w-full mt-10 p-4">
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 dark:bg-neutral-800/50">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500"></div>
                        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">Available RSEs</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {emptyRSEs.map(rse => (
                            <Link
                                key={rse.rse_id}
                                href={`/rse/list?expression=${rse.rse}&autoSearch=true`}
                                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-sm transition-all text-neutral-900 dark:text-neutral-100 group"
                            >
                                <HiExternalLink className="text-sm flex-shrink-0 text-neutral-400 dark:text-neutral-500 group-hover:text-brand-500" />
                                <span className="text-sm font-medium">{rse.rse}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <KeyValueWrapper className="w-full p-5 overflow-x-auto space-y-2">
            <Heading text="RSE Usage" size="md" />
            {hasUsages && <CustomLegend legendOptions={legendOptions} />}
            <div className="flex flex-col min-w-[700px] items-center justify-center">
                {isResultEmpty && (
                    <div className="h-[740px] flex items-center justify-center">
                        <InfoField>
                            <span>No RSEs configured</span>
                        </InfoField>
                    </div>
                )}
                {errorMessage && (
                    <div className="h-[740px] flex items-center justify-center">
                        <WarningField>
                            <span>{errorMessage}</span>
                        </WarningField>
                    </div>
                )}
                {isLoading && (
                    <div className="h-[740px] flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                )}
                {!isLoading && !errorMessage && (
                    <>
                        {hasUsages ? (
                            <div className="h-[740px] flex items-center justify-center w-full">{getCharts()}</div>
                        ) : (
                            hasEmptyRSEs && (
                                <div className="py-8 flex items-center justify-center w-full">
                                    <div className="text-center space-y-2">
                                        <p className="text-neutral-600 dark:text-neutral-400">No storage usage data available</p>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-500">
                                            Charts will appear once files are stored in your RSEs
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                        {hasEmptyRSEs && getEmptyRSEsList()}
                    </>
                )}
            </div>
        </KeyValueWrapper>
    );
};
