import { TRuleIDDIDPair } from "@/lib/infrastructure/data/view-model/create-rule";
import { RulePage } from "../RulePage";
import { CreateRuleStatusPage } from "./CreateRuleStatusPage";


export const CreateRuleStatusTabPage = (props:{
    activePage: number
    pagePrevFunction: (event: any) => void
    QueryStatus: {
        status: 'success' | 'error' | 'pending';
        message?: string | undefined;
        rules: TRuleIDDIDPair[]
    }
}) => {


    return(
        <RulePage pagenum={4} activePage={props.activePage} onPrev={props.pagePrevFunction} onNext={() =>{}} allowNext={false} allowPrev={props.QueryStatus.status === 'error'}>
            <CreateRuleStatusPage createRuleViewModel={props.QueryStatus} />
        </RulePage>

    )

}