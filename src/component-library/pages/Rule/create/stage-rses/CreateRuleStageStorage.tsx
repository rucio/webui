import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { CreateRuleParameters, CreateRuleStorage } from '@/lib/infrastructure/data/view-model/rule';
import { cn } from '@/component-library/utils';
import { HintLink } from '@/component-library/atoms/misc/HintLink';
import { Input } from '@/component-library/atoms/form/input';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { ChangeEvent, useEffect, useState } from 'react';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { CreateRuleStageStorageTable } from '@/component-library/pages/Rule/create/stage-rses/CreateRuleStageStorageTable';
import { SelectionChangedEvent } from 'ag-grid-community';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { WarningField } from '@/component-library/features/fields/WarningField';
import Checkbox from '@/component-library/atoms/form/Checkbox';

const DEFAULT_EXPRESSION = '*';

type CreateRuleStageStorage = {
    visible: boolean;
    parameters: CreateRuleParameters;
    updateStorage: (storage: CreateRuleStorage) => void;
    updateNeedsApproval: (needsApproval: boolean) => void;
    updateAskApproval: (askApproval: boolean) => void;
};

export const CreateRuleStageStorage = (props: CreateRuleStageStorage) => {
    const totalDataSize = props.parameters.dids.reduce((accumulator, current) => accumulator + current.bytes, 0);
    const selectedItems = props.parameters.rses;

    const [expression, setExpression] = useState<string | null>(DEFAULT_EXPRESSION);
    const [needsApproval, setNeedsApproval] = useState<boolean>(false);
    const [askApproval, setAskApproval] = useState<boolean>(false);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setExpression(value !== '' ? value : DEFAULT_EXPRESSION);
    };

    const { onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<RSEAccountUsageLimitViewModel>();

    const onSearch = (event: any) => {
        event.preventDefault();
        startStreaming('/api/feature/list-account-rse-quotas', {
            method: 'POST',
            // TODO: redo the endpoint to only accept the rseExpression via GET
            body: JSON.stringify({
                rseExpression: expression ?? DEFAULT_EXPRESSION,
                requestedDIDs: props.parameters.dids,
            }),
        });
    };

    const onStop = (event: any) => {
        event.preventDefault();
        stopStreaming();
    };

    const onSelectionChanged = (event: SelectionChangedEvent) => {
        const selected: RSEAccountUsageLimitViewModel[] = event.api.getSelectedRows();
        // TODO: determine if all rows are picked and simplify the request to the rseExpression
        props.updateStorage({
            rses: selected,
        });
    };

    useEffect(() => {
        const hasSingleSufficient = selectedItems.some(element => element.bytes_remaining >= totalDataSize);
        const changeNeedsApproval = selectedItems.length > 0 && !hasSingleSufficient;
        setNeedsApproval(changeNeedsApproval);
        props.updateNeedsApproval(changeNeedsApproval);
    }, [selectedItems]);

    useEffect(() => {
        props.updateAskApproval(askApproval);
    }, [askApproval]);

    const isChoiceInvalid = needsApproval && !askApproval;

    const getInfoField = () => {
        let text;
        if (selectedItems.length === 0) {
            text = <span>Please select at least one RSE</span>;
        } else {
            text = (
                <span>
                    <b>{selectedItems.length}</b> chosen
                </span>
            );
        }
        return <InfoField className="whitespace-normal">{text}</InfoField>;
    };

    const getWarningField = () => {
        let text;
        if (selectedItems.length === 1) {
            text = <span>The chosen RSE does not have enough quota left. Please choose different RSEs or mark the rule as in need of approval.</span>;
        } else {
            text = (
                <span>
                    Out of <b>{selectedItems.length}</b> chosen RSEs, none has enough quota left. Please choose different RSEs or mark the rule as in
                    need of approval.
                </span>
            );
        }
        return <WarningField className="whitespace-normal">{text}</WarningField>;
    };

    return (
        <div className={cn('flex flex-col space-y-3 w-full grow', props.visible ? 'visible' : 'hidden')}>
            <div className="space-y-2">
                <div className="text-neutral-900 dark:text-neutral-100">
                    Expression
                    <HintLink href="https://rucio.github.io/documentation/started/concepts/rse_expressions" className="pl-2" />
                </div>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-center sm:items-start">
                    <Input className="w-full sm:flex-grow" onChange={onInputChange} onEnterKey={onSearch} placeholder={DEFAULT_EXPRESSION} />
                    <SearchButton isRunning={streamingHook.status === StreamingStatus.RUNNING} onStop={onStop} onSearch={onSearch} />
                </div>
            </div>
            <div className="h-[500px] flex flex-col">
                <CreateRuleStageStorageTable
                    streamingHook={streamingHook}
                    onSelectionChanged={onSelectionChanged}
                    onGridReady={onGridReady}
                    totalDataSize={totalDataSize}
                    selectedItems={selectedItems}
                />
            </div>
            {isChoiceInvalid ? getWarningField() : getInfoField()}
            <div className="flex flex-row items-center space-x-2 w-fit" onClick={() => setAskApproval(prevState => !prevState)}>
                <Checkbox checked={askApproval} />
                <span className="cursor-pointer select-none">The rule needs approval</span>
            </div>
        </div>
    );
};
