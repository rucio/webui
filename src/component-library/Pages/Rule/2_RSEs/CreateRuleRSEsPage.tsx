import { RSEAccountUsageLimitViewModel } from "@/lib/infrastructure/data/view-model/rse"
import { HTTPRequest } from "@/lib/sdk/http"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { CreateRulePageProps } from "../CreateRule"
import { Button } from "@/component-library/Button/Button"
import { Checkbox } from "@/component-library/Button/Checkbox"
import { TextInput } from "@/component-library/Input/TextInput"
import { P } from "@/component-library/Text/Content/P"
import { CreateRuleRSETable } from "./CreateRuleRSETable"
import { RulePage } from "../RulePage"
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did"


interface PageRSEsState {
    page1progressBlocked: boolean
    RSEExpression: string
    RSESelection: Array<RSEAccountUsageLimitViewModel>
    askForApproval: boolean
}

export const CreateRuleRSEsPage = (props: {
    activePage: number
    setActivePage: Dispatch<SetStateAction<number>>
    CreateRulePageProps: CreateRulePageProps
    selectedDIDs : ListDIDsViewModel[]
    setRses: Dispatch<SetStateAction<{
        selectedRSEs: RSEAccountUsageLimitViewModel[];
        askForApproval: boolean;
    }>>
    pagePrevFunction: (event: any) => void
}
) => {
    // set state to store the RSE page information
    const [PageRSEsState, setPageRSEsState] = useState<PageRSEsState>({
        RSEExpression: "",
        RSESelection: [],
        askForApproval: false,
        page1progressBlocked: true
    })

    useEffect(() => {
        // set page1progressblocked to true if RSESelection is empty
        if (PageRSEsState.RSESelection.length === 0) {
            setPageRSEsState({ ...PageRSEsState, page1progressBlocked: true })
        }
        // set page1progressblocked to true if any selected RSE needs quota and Ask for Approval is not checked
        else if(!PageRSEsState.askForApproval){
            let needsApproval = false
            PageRSEsState.RSESelection.forEach(element => {
                if(!element.has_quota){
                    needsApproval = true
                    return
                }
            });
            if(needsApproval){
                setPageRSEsState({ ...PageRSEsState, page1progressBlocked: true })
            } else {
                setPageRSEsState({ ...PageRSEsState, page1progressBlocked: false })
            }
        } else if(PageRSEsState.askForApproval){
            setPageRSEsState({ ...PageRSEsState, page1progressBlocked: false })
        }
        else {
            setPageRSEsState({ ...PageRSEsState, page1progressBlocked: false })
        }
    }, [PageRSEsState.RSESelection, PageRSEsState.askForApproval])


    const pageRSESearch = async (event: any, explicitRSEExpression?: string) => {
        // sometimes the state has not updated yet, so use explicitly passed RSEExpr
        var RSEExpression = explicitRSEExpression ? explicitRSEExpression : PageRSEsState.RSEExpression
        // build request for comdom
        const request: HTTPRequest = {
            url: new URL(`${window.location.protocol}//${window.location.host}/api/feature/list-account-rse-quotas`),
            method: "POST",
            headers: new Headers({
                'Content-Type': 'application/json'
            } as HeadersInit),
            body: {
                "requestedDIDs": props.selectedDIDs,
                "rseExpression": RSEExpression,
            }
        }
        // run query
        await props.CreateRulePageProps.rseListComDOM.setRequest(request)
        await props.CreateRulePageProps.rseListComDOM.start()
    }

    // function that sets RSEs information before going to the next page
    const NextPage = (event : any) => {
        
        props.setRses({selectedRSEs: PageRSEsState.RSESelection, askForApproval: PageRSEsState.askForApproval})
        props.setActivePage(props.activePage + 1)
        return
    }

    return (
        <>
        <RulePage pagenum={1} allowNext allowPrev activePage={props.activePage} progressBlocked={PageRSEsState.page1progressBlocked} onNext={NextPage} onPrev={props.pagePrevFunction}>
                    <div className="flex flex-col space-y-2 m-2">
                        <div className="flex w-full flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                            <label className="-mb-2 sm:mt-2.5 sm:w-36" htmlFor='rse-expression'><P>RSE Expression</P></label>
                            <div className="grow">
                                <TextInput
                                    id='rse-expression'
                                    onBlur={(event) => { setPageRSEsState({ ...PageRSEsState, RSEExpression: event.target.value }) }}
                                    onEnterkey={(event) => { setPageRSEsState({ ...PageRSEsState, RSEExpression: event.target.value }); pageRSESearch(event, event.target.value); }}
                                />
                            </div>
                            <div className="w-full sm:w-24">
                                <Button type="submit" label="Search" onClick={pageRSESearch} />
                            </div>
                        </div>
                        <CreateRuleRSETable
                            comdom={props.CreateRulePageProps.rseListComDOM}
                            handleChange={(data: RSEAccountUsageLimitViewModel[]) => { setPageRSEsState({ ...PageRSEsState, RSESelection: data }) }}
                            askApproval={PageRSEsState.askForApproval}
                        />
                        <div>
                            <Checkbox
                                label="Ask for Approval"
                                type="checkbox"
                                onChange={(event: any) => { setPageRSEsState({ ...PageRSEsState, askForApproval: event.target.checked }) }}
                                checked={PageRSEsState.askForApproval}
                            />
                        </div>
                    </div>
                </RulePage>

        </>
    )

}