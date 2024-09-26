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
import { useState } from 'react';
import ToggleHeader from '@/component-library/features/search/ToggleHeader';

type CreateRuleStageDataProps = {
    visible: boolean;
    parameters: CreateRuleParameters;
    addDID: (did: ListDIDsViewModel) => void;
    removeDID: (did: ListDIDsViewModel) => void;
};

export const CreateRuleStageData = (props: CreateRuleStageDataProps) => {
    const selectedItems = props.parameters.dids;
    const totalSize = selectedItems.reduce((accumulator, current) => accumulator + current.bytes, 0);

    const { onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<ListDIDsViewModel>();
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(selectedItems.length === 0);

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
        return <InfoField>{text}</InfoField>;
    };

    return (
        <div className={cn('flex flex-col space-y-3 w-full grow', props.visible ? 'visible' : 'hidden')}>
            <ToggleHeader text="Search" isOpen={isSearchOpen} onClick={() => setIsSearchOpen(prevState => !prevState)} />
            <div className={`space-y-3 ${isSearchOpen ? 'visible' : 'hidden'}`}>
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
            {selectedItems.length !== 0 && (
                <CreateRuleTableWrapper>
                    <CreateRuleStageDataSelectedTable rowData={selectedItems} removeDID={did => props.removeDID(did)} />
                </CreateRuleTableWrapper>
            )}
            {getInfoField()}
        </div>
    );
};
