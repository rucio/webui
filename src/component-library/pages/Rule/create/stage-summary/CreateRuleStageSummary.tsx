import { CreateRuleParameters } from '@/lib/infrastructure/data/view-model/rule';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { CreateRuleTableWrapper } from '@/component-library/pages/Rule/create/CreateRuleTableWrapper';
import { CreateRuleStageSummaryDataTable } from '@/component-library/pages/Rule/create/stage-summary/CreateRuleStageSummaryDataTable';
import { CreateRuleStageSummaryStorageTable } from '@/component-library/pages/Rule/create/stage-summary/CreateRuleStageSummaryStorageTable';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { Heading } from '@/component-library/atoms/misc/Heading';

const StatCard = ({ label, value }: { label: string; value: string | number }) => {
    return (
        <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{label}</span>
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</span>
        </div>
    );
};

const KeyValueDIDs = ({ dids }: { dids: ListDIDsViewModel[] }) => {
    const totalFiles = dids.reduce((previous, current) => previous + current.length, 0);
    const totalBytes = dids.reduce((previous, current) => previous + current.bytes, 0);

    return (
        <div className="grid grid-cols-2 gap-6">
            <StatCard label="Total files" value={totalFiles} />
            <StatCard label="Total size" value={formatFileSize(totalBytes)} />
        </div>
    );
};

const OptionRow = ({ label, value, isBoolean }: { label: string; value: string | number | boolean; isBoolean?: boolean }) => {
    return (
        <div className="flex items-center justify-between py-3 px-4 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0 bg-neutral-0 dark:bg-neutral-800">
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{label}</span>
            {isBoolean ? (
                <div className="flex items-center space-x-2">
                    <Checkbox checked={value as boolean} />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{value ? 'Enabled' : 'Disabled'}</span>
                </div>
            ) : (
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{value}</span>
            )}
        </div>
    );
};

const KeyValueOptions = ({ parameters }: { parameters: CreateRuleParameters }) => {
    const hasSampling = parameters.sample && parameters.sampleFileCount;

    return (
        <div className="space-y-0">
            <OptionRow label="Copies" value={parameters.copies} />
            {parameters.daysLifetime && <OptionRow label="Lifetime" value={`${parameters.daysLifetime} days`} />}
            <OptionRow label="Receive notifications" value={parameters.notify} isBoolean />
            <OptionRow label="Asynchronous" value={parameters.asynchronous} isBoolean />
            {parameters.grouping && <OptionRow label="Grouping" value={parameters.grouping} />}
            {parameters.comments && <OptionRow label="Comments" value={parameters.comments} />}
            {hasSampling && <OptionRow label="Sample file count" value={parameters.sampleFileCount ?? 0} />}
        </div>
    );
};

type CreateRuleStageSummaryProps = {
    parameters: CreateRuleParameters;
};

export const CreateRuleStageSummary = ({ parameters }: CreateRuleStageSummaryProps) => {
    const getDefaultDataInfoField = () => {
        const plural = parameters.dids.length > 1 ? 's' : '';
        const sample = parameters.sample ? <b>samples of</b> : '';

        let text;
        if (parameters.askApproval) {
            text = (
                <span>
                    This request will <b>ask for approval</b> to create a rule for {sample} the following DID{plural}.
                </span>
            );
        } else {
            text = (
                <span>
                    This request will create a rule for {sample} the following DID{plural}.
                </span>
            );
        }

        return <InfoField>{text}</InfoField>;
    };

    const getDefaultStorageInfoField = () => {
        const pluralRules = parameters.dids.length > 1 ? 's' : '';
        const pluralStorage = parameters.rses.length > 1 ? 's' : '';

        return (
            <InfoField>
                <span>
                    The rule{pluralRules} will replicate to one of the following RSE{pluralStorage}.
                </span>
            </InfoField>
        );
    };

    return (
        <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
                {/* DIDs Section */}
                <div className="p-6 space-y-4">
                    <div className="space-y-3">
                        <Heading text="DIDs" size="md" />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Review the data identifiers (DIDs) that will be included in this rule
                        </p>
                    </div>
                    {getDefaultDataInfoField()}
                    {parameters.dids.some(did => did.open) && (
                        <InfoField>
                            <span>
                                There are open DIDs present in your request. Everything that will be added to them after you created the rule will
                                also be transferred to the selected RSEs.
                            </span>
                        </InfoField>
                    )}
                </div>

                {/* DIDs Table */}
                <div className="p-6">
                    <CreateRuleTableWrapper>
                        <CreateRuleStageSummaryDataTable rowData={parameters.dids} copies={parameters.copies} />
                    </CreateRuleTableWrapper>
                </div>

                {/* DIDs Stats */}
                <div className="p-6">
                    <KeyValueDIDs dids={parameters.dids} />
                </div>

                {/* RSEs Section */}
                <div className="p-6 space-y-4">
                    <div className="space-y-3">
                        <Heading text="RSEs" size="md" />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Review the Rucio Storage Elements (RSEs) where data will be replicated
                        </p>
                    </div>
                    {getDefaultStorageInfoField()}
                </div>

                {/* RSEs Table */}
                <div className="p-6">
                    <CreateRuleTableWrapper>
                        <CreateRuleStageSummaryStorageTable rowData={parameters.rses} />
                    </CreateRuleTableWrapper>
                </div>

                {/* Options Section */}
                <div className="p-6 space-y-4">
                    <div className="space-y-3">
                        <Heading text="Options" size="md" />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Review the configuration options for this replication rule</p>
                    </div>
                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                        <KeyValueOptions parameters={parameters} />
                    </div>
                </div>
            </div>
        </div>
    );
};
