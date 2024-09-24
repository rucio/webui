import { CreateRuleParameters } from '@/lib/infrastructure/data/view-model/rule';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { CreateRuleTableWrapper } from '@/component-library/pages/Rule/create/CreateRuleTableWrapper';
import { CreateRuleStageSummaryDataTable } from '@/component-library/pages/Rule/create/stage-summary/CreateRuleStageSummaryDataTable';
import { CreateRuleStageSummaryStorageTable } from '@/component-library/pages/Rule/create/stage-summary/CreateRuleStageSummaryStorageTable';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { Field } from '@/component-library/atoms/misc/Field';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import Checkbox from '@/component-library/atoms/form/Checkbox';
import { Heading } from '@/component-library/atoms/misc/Heading';

const KeyValueDIDs = ({ dids }: { dids: ListDIDsViewModel[] }) => {
    const totalFiles = dids.reduce((previous, current) => previous + current.length, 0);
    const totalBytes = dids.reduce((previous, current) => previous + current.bytes, 0);

    return (
        <KeyValueWrapper className="overflow-x-auto py-2">
            <KeyValueRow name="Total files">
                <Field>{totalFiles}</Field>
            </KeyValueRow>
            <KeyValueRow name="Total size">
                <Field>{formatFileSize(totalBytes)}</Field>
            </KeyValueRow>
        </KeyValueWrapper>
    );
};

const KeyValueOptions = ({ parameters }: { parameters: CreateRuleParameters }) => {
    return (
        <KeyValueWrapper className="overflow-x-auto py-2">
            <KeyValueRow name="Lifetime">
                <Field>{parameters.daysLifetime} days</Field>
            </KeyValueRow>
            <KeyValueRow name="Notifications">
                <Checkbox checked={parameters.notify} />
            </KeyValueRow>
            <KeyValueRow name="Asynchronous">
                <Checkbox checked={parameters.asynchronous} />
            </KeyValueRow>
            <KeyValueRow name="Group by">
                <Field>{parameters.grouping}</Field>
            </KeyValueRow>
            <KeyValueRow name="Comment">
                <Field>{parameters.comments}</Field>
            </KeyValueRow>
        </KeyValueWrapper>
    );
};

type CreateRuleStageSummaryProps = {
    parameters: CreateRuleParameters;
};

export const CreateRuleStageSummary = ({ parameters }: CreateRuleStageSummaryProps) => {
    const getDefaultDataInfoField = () => {
        const plural = parameters.dids.length > 1 ? 's' : '';

        let text;
        if (parameters.askApproval) {
            text = (
                <span>
                    This request will <b>ask for approval</b> to create a rule for the following DID{plural}.
                </span>
            );
        } else {
            text = <span>This request will create rules for the following DID{plural}.</span>;
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
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="DIDs" size="md" />
            {getDefaultDataInfoField()}
            {parameters.dids.some(did => did.open) && (
                <InfoField>
                    <span>
                        There are open DIDs present in your request. Everything that will be added to them after you created the rule will also be
                        transferred to the selected RSEs.
                    </span>
                </InfoField>
            )}
            <CreateRuleTableWrapper>
                <CreateRuleStageSummaryDataTable rowData={parameters.dids} copies={parameters.copies} />
            </CreateRuleTableWrapper>
            <KeyValueDIDs dids={parameters.dids} />
            <Heading text="RSEs" size="md" />
            {getDefaultStorageInfoField()}
            <CreateRuleTableWrapper>
                <CreateRuleStageSummaryStorageTable rowData={parameters.rses} />
            </CreateRuleTableWrapper>
            <Heading text="Options" size="md" />
            <KeyValueOptions parameters={parameters} />
        </div>
    );
};
