import useTableStreaming from "@/lib/infrastructure/hooks/useTableStreaming";
import {StreamingStatus} from "@/lib/infrastructure/hooks/useStreamReader";
import {DIDLongViewModel} from "@/lib/infrastructure/data/view-model/did";
import {DIDSearchPanel} from "@/component-library/features/search/DIDSearchPanel";
import {CreateRuleParameters} from "@/lib/infrastructure/data/view-model/rule";
import {CreateRuleStageDataTable} from "@/component-library/pages/Rule/create/stage-dids/CreateRuleStageDataTable";
import {cn} from "@/component-library/utils";

// TODO: move to shared constants file
//const DATA_KEY = 'create_rule_dids';

type CreateRuleStageData = {
    visible: boolean;
    parameters: CreateRuleParameters,
    addDID: (did: DIDLongViewModel) => void,
    removeDID: (did: DIDLongViewModel) => void,
};

export const CreateRuleStageData = (props: CreateRuleStageData) => {
    //const initialDataString = localStorage.getItem(DATA_KEY);

    const {onGridReady, streamingHook, startStreaming, stopStreaming, gridApi} = useTableStreaming<DIDLongViewModel>(
        //initialDataString ? JSON.parse(initialDataString) : undefined
    );

    // const onGridReady = (event: GridReadyEvent) => {
    //     defaultOnGridReady(event);
    //     const selectedNodes: IRowNode[] = [];
    //     console.log(selectedNodes);
    //     gridApi?.forEachNode(node => {
    //         if (props.parameters.dids.includes(node.data)) {
    //             selectedNodes.push(node);
    //         }
    //     });
    //     event.api.setNodesSelected({
    //         nodes: selectedNodes,
    //         newValue: true
    //     })
    // }
    //
    // useEffect(() => {
    //     if (streamingHook.status === StreamingStatus.STOPPED) {
    //         const rowData: DIDLongViewModel[] = [];
    //         gridApi?.forEachNode(node => rowData.push(node.data));
    //         if (rowData.length !== 0) {
    //             localStorage.setItem(DATA_KEY, JSON.stringify(rowData));
    //         }
    //     }
    // }, [streamingHook.status]);

    return (
        <div className={cn("flex flex-col space-y-3 w-full grow", props.visible ? 'visible' : 'hidden')}>
            <DIDSearchPanel startStreaming={startStreaming} stopStreaming={stopStreaming}
                            isRunning={streamingHook.status === StreamingStatus.RUNNING}/>
            <CreateRuleStageDataTable
                streamingHook={streamingHook}
                onGridReady={onGridReady}
                addDID={(did) => props.addDID(did)}
                removeDID={(did) => props.removeDID(did)}
                selectedItems={props.parameters.dids}
            />
            <p>{props.parameters.dids.length} chosen</p>
        </div>
    );
};