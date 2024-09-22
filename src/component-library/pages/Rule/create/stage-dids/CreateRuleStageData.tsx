import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { DIDLongViewModel } from '@/lib/infrastructure/data/view-model/did';
import { DIDSearchPanel } from '@/component-library/features/search/DIDSearchPanel';
import { CreateRuleParameters } from '@/lib/infrastructure/data/view-model/rule';
import { CreateRuleStageDataTable } from '@/component-library/pages/Rule/create/stage-dids/CreateRuleStageDataTable';
import { cn } from '@/component-library/utils';
import { Field } from '@/component-library/atoms/misc/Field';
import { HiInformationCircle } from 'react-icons/hi';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { CreateRuleStageDataSelectedTable } from '@/component-library/pages/Rule/create/stage-dids/CreateRuleStageDataSelectedTable';
import { useEffect } from 'react';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { CreateRuleTableWrapper } from '@/component-library/pages/Rule/create/CreateRuleTableWrapper';

type CreateRuleStageData = {
    visible: boolean;
    parameters: CreateRuleParameters;
    addDID: (did: DIDLongViewModel) => void;
    removeDID: (did: DIDLongViewModel) => void;
};

export const CreateRuleStageData = (props: CreateRuleStageData) => {
    const selectedItems = props.parameters.dids;
    const totalSize = selectedItems.reduce((accumulator, current) => accumulator + current.bytes, 0);

    const { onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<DIDLongViewModel>();

    const getInfoField = () => {
        let text;
        if (selectedItems.length === 0) {
            text = <span>Please select at least one identifier</span>;
        } else {
            text = (
                <span>
                    <b>{selectedItems.length}</b> chosen, <b>{formatFileSize(totalSize)}</b> in total
                </span>
            );
        }
        return <InfoField className="flex-shrink-0">{text}</InfoField>;
    };

    return (
        <div className={cn('flex flex-col space-y-3 w-full grow', props.visible ? 'visible' : 'hidden')}>
            {getInfoField()}
            {selectedItems.length !== 0 && (
                <CreateRuleTableWrapper>
                    <CreateRuleStageDataSelectedTable rowData={selectedItems} removeDID={did => props.removeDID(did)} />
                </CreateRuleTableWrapper>
            )}
            <DIDSearchPanel
                startStreaming={startStreaming}
                stopStreaming={stopStreaming}
                isRunning={streamingHook.status === StreamingStatus.RUNNING}
            />
            <CreateRuleTableWrapper>
                <CreateRuleStageDataTable
                    streamingHook={streamingHook}
                    onGridReady={onGridReady}
                    addDID={did => props.addDID(did)}
                    removeDID={did => props.removeDID(did)}
                    selectedItems={selectedItems}
                />
            </CreateRuleTableWrapper>
        </div>
    );
};
