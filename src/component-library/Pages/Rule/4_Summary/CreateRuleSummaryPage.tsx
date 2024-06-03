import { DIDType } from "@/lib/core/entity/rucio"
import { Dispatch, SetStateAction } from "react"
import { RulePage } from "../RulePage"
import { SummaryPage } from "./SummaryPage"
import { RuleSummaryViewModel } from "@/lib/infrastructure/data/view-model/rule"
import { CreateRulePageProps } from "../CreateRule"
import { TCreateRuleFeatureRequestParams } from "@/pages/api/feature/create-rule"
import { RSEAccountUsageLimitViewModel } from "@/lib/infrastructure/data/view-model/rse"
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did"

export const CreateRuleSummaryPage = (props:{
    activePage: number
    setActivePage: Dispatch<SetStateAction<number>>
    summaryViewModel: RuleSummaryViewModel | undefined
    CreateRulePageProps: CreateRulePageProps
    selectedDIDs : ListDIDsViewModel[]
    RSEsInformation: {
        selectedRSEs: RSEAccountUsageLimitViewModel[];
        askForApproval: boolean;
    }
    Options:{
        lifetime: number;
        expiryDate: Date;
        enableNotifications: boolean;
        asynchronousMode: boolean;
        numcopies: number;
        takesamples: boolean;
        numsamples: number;
        freeComment: string;
        groupBy: DIDType;
    }
    pagePrevFunction: (event: any) => void
    setQueryResults : any
})=>{

    // Submits the Rule request and loads the query status
    const submitRuleRequestAndLoadStatus = async (event: any) => {
        props.setQueryResults({ rules: [], status: 'pending' })
        props.setActivePage(4)
        const createRulesRequest:TCreateRuleFeatureRequestParams  = {
            RSEViewModels: props.RSEsInformation.selectedRSEs,
            DIDViewModels: props.selectedDIDs,
            lifetime: props.Options.lifetime,
            expirydate: props.Options.expiryDate,
            notifications: props.Options.enableNotifications,
            asynchronousMode: props.Options.asynchronousMode,
            numcopies: props.Options.numcopies,
            numsamples: props.Options.numsamples,
            groupby: props.Options.groupBy,
            comment: props.Options.freeComment,
            approval: props.RSEsInformation.askForApproval
        }

        const response = await props.CreateRulePageProps.onSubmit(createRulesRequest)
        props.setQueryResults(response)
    }



    return (
        <>
        <RulePage pagenum={3} activePage={props.activePage} allowNext allowPrev onNext={submitRuleRequestAndLoadStatus} onPrev={props.pagePrevFunction} submit>
                    <SummaryPage data={props.summaryViewModel? props.summaryViewModel : {
                        status: 'error',
                        message: 'Please check your inputs on previous pages! Cannot retrieve summary from the server',
                        RSEViewModels: [],
                        DIDViewModels: [],
                        expirydate: new Date(2025, 1, 1),
                        lifetime: 0,
                        notifications: false,
                        asynchronousMode: false,
                        numcopies: 0,
                        takeSamples: false,
                        numsamples: 0,
                        groupby: DIDType.UNKNOWN,
                        comment: '',
                        approval: false,
                        accountInfo: props.CreateRulePageProps.accountInfo,
                    }} />
                </RulePage>
        </>
    )
}