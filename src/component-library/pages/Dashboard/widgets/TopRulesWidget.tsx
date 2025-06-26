import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { Bar, BarChart, ResponsiveContainer, Text, Tooltip, XAxis, YAxis } from 'recharts';
import { HiExternalLink } from 'react-icons/hi';
import { LockStateBadge } from '@/component-library/features/badges/Rule/LockStateBadge';
import { LockState } from '@/lib/core/entity/rucio';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { WarningField } from '@/component-library/features/fields/WarningField';
import CustomLegend, { LegendOption } from './CustomLegend';
import { useTheme } from 'next-themes';

const openRule = (id: string) => {
    window.open(`/rule/page/${id}`, '_blank');
};

const LinkTick = (props: any) => {
    const id = props.payload.value.substring(0, 12);
    const fill = props.fill;

    return (
        <g onClick={() => openRule(id)} className="cursor-pointer">
            <Text {...props} fill={fill}>
                {id}
            </Text>
        </g>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const { locksOk, locksReplicating, locksStuck, name, scope, rseExpression } = payload[0].payload;

        return (
            <KeyValueWrapper className="p-3 space-y-2 text-neutral-900 dark:text-neutral-100">
                <div className="mb-2">
                    <div className="flex space-x-2 items-center">
                        <HiExternalLink />
                        <span>{label}</span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        For {scope}:{name}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">On {rseExpression}</p>
                </div>

                <div>
                    <LockStateBadge value={LockState.OK} />: {locksOk}
                </div>
                <div>
                    <LockStateBadge value={LockState.REPLICATING} />: {locksReplicating}
                </div>
                <div>
                    <LockStateBadge value={LockState.STUCK} />: {locksStuck}
                </div>
            </KeyValueWrapper>
        );
    }

    return null;
};

const RuleBarChart = ({ rules }: { rules: RuleViewModel[] }) => {
    const data = rules.map(rule => {
        const totalLocks = rule.locks_stuck_cnt + rule.locks_replicating_cnt + rule.locks_ok_cnt;

        // Calculate initial percentages
        let locksOkPercentage = (rule.locks_ok_cnt / totalLocks) * 100;
        let locksReplicatingPercentage = (rule.locks_replicating_cnt / totalLocks) * 100;
        let locksStuckPercentage = 100 - locksOkPercentage - locksReplicatingPercentage;

        return {
            id: rule.id,
            scope: rule.scope,
            name: rule.name,
            rseExpression: rule.rse_expression,
            locksOkPercentage: locksOkPercentage,
            locksOk: rule.locks_ok_cnt,
            locksReplicatingPercentage: locksReplicatingPercentage,
            locksReplicating: rule.locks_replicating_cnt,
            locksStuckPercentage: locksStuckPercentage,
            locksStuck: rule.locks_stuck_cnt,
        };
    });

    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    // Tailwind neutral-100 or neutral-900
    const fillColor = isDarkMode ? '#f1f5f9' : '#0f172a';
    const borderColor = isDarkMode ? 'rgba(241,245,249,0.15)' : 'rgba(15,23,42,0.15)';

    const barColors: Record<string, any> = {
        locksOkPercentage: {
            fill: 'rgba(34,197,94,0.8)', // Tailwind base-success-500
            stroke: borderColor,
        },
        locksReplicatingPercentage: {
            fill: 'rgba(251,191,36,0.8)', // Tailwind base-warning-400
            stroke: borderColor,
        },
        locksStuckPercentage: {
            fill: 'rgba(239,68,68,0.8)', // Tailwind base-error-500
            stroke: borderColor,
        },
    };

    const getStyledBar = (dataKey: string) => {
        return (
            <Bar
                dataKey={dataKey}
                stackId="locks"
                fill={barColors[dataKey].fill}
                maxBarSize={35}
                stroke={barColors[dataKey].stroke}
                strokeWidth={1}
            />
        );
    };

    return (
        <ResponsiveContainer>
            <BarChart
                layout="vertical"
                data={data}
                onClick={event => {
                    openRule(event.activePayload?.[0].payload.id);
                }}
            >
                <XAxis
                    type="number"
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    tickFormatter={value => {
                        return `${value}%`;
                    }}
                    stroke={fillColor}
                />
                <YAxis dataKey="id" type="category" tick={<LinkTick fill={fillColor} />} width={120} stroke={fillColor} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: borderColor }} />
                {getStyledBar('locksOkPercentage')}
                {getStyledBar('locksReplicatingPercentage')}
                {getStyledBar('locksStuckPercentage')}
            </BarChart>
        </ResponsiveContainer>
    );
};

const legendOptions: LegendOption[] = [
    { label: 'OK', color: 'bg-base-success-500' },
    { label: 'Replicating', color: 'bg-base-warning-400' },
    { label: 'Error', color: 'bg-base-error-500' },
];

interface TopRulesWidgetProps {
    rules?: RuleViewModel[];
    isLoading: boolean;
    errorMessage?: string;
}

export const TopRulesWidget = ({ rules, isLoading, errorMessage }: TopRulesWidgetProps) => {
    // Take top 10 latest rules
    const displayedRules = rules
        ?.filter(rule => rule.locks_stuck_cnt + rule.locks_replicating_cnt + rule.locks_ok_cnt > 0)
        .sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateA.getTime() - dateB.getTime(); // Sort in ascending order
        })
        .slice(0, 10);

    const hasRules = displayedRules && displayedRules.length !== 0;
    const isResultEmpty = !hasRules && !errorMessage && !isLoading;

    return (
        <KeyValueWrapper className="w-full p-5 overflow-x-auto">
            <Heading text="Locks of latest rules" size="md" />
            <div className="flex min-w-[700px] h-[500px] items-center justify-center my-5">
                {isResultEmpty && (
                    <InfoField>
                        <span>No rules to show</span>
                    </InfoField>
                )}
                {errorMessage && (
                    <WarningField>
                        <span>{errorMessage}</span>
                    </WarningField>
                )}
                {hasRules && <RuleBarChart rules={displayedRules} />}
                {isLoading && <LoadingSpinner />}
            </div>
            {hasRules && <CustomLegend legendOptions={legendOptions} />}
        </KeyValueWrapper>
    );
};
