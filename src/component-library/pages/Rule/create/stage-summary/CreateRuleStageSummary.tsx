import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { DIDSearchPanel } from '@/component-library/features/search/DIDSearchPanel';
import { CreateRuleParameters } from '@/lib/infrastructure/data/view-model/rule';
import { CreateRuleStageDataTable } from '@/component-library/pages/Rule/create/stage-dids/CreateRuleStageDataTable';
import { cn } from '@/component-library/utils';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { CreateRuleStageDataSelectedTable } from '@/component-library/pages/Rule/create/stage-dids/CreateRuleStageDataSelectedTable';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { CreateRuleTableWrapper } from '@/component-library/pages/Rule/create/CreateRuleTableWrapper';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { CreateRuleStageSummaryDataTable } from '@/component-library/pages/Rule/create/stage-summary/CreateRuleStageSummaryDataTable';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { CreateRuleStageSummaryStorageTable } from '@/component-library/pages/Rule/create/stage-summary/CreateRuleStageSummaryStorageTable';

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
            {getDefaultStorageInfoField()}
            <CreateRuleTableWrapper>
                <CreateRuleStageSummaryStorageTable rowData={parameters.rses} />
            </CreateRuleTableWrapper>
        </div>
    );
};
