import { DIDType } from "@/lib/core/entity/rucio"
import { Dispatch, SetStateAction, useState } from "react"
import { CreateRulePageProps } from "../CreateRule"
import { Button } from "@/component-library/Button/Button"
import { Checkbox } from "@/component-library/Button/Checkbox"
import { Collapsible } from "@/component-library/Helpers/Collapsible"
import { AreaInput } from "@/component-library/Input/AreaInput"
import { NumInput } from "@/component-library/Input/NumInput"
import { SamplingTag } from "@/component-library/Tags/SamplingTag"
import { Label } from "@/component-library/Text/Content/Label"
import { twMerge } from "tailwind-merge"
import { Dropdown } from "../GroupingDropdown"
import { LifetimeWithExpirationDateInput } from "../LifetimeWithExpiryDateInput"
import { RulePage } from "../RulePage"
import { RuleSummaryViewModel } from "@/lib/infrastructure/data/view-model/rule"
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did"
import { RSEAccountUsageLimitViewModel } from "@/lib/infrastructure/data/view-model/rse"


interface PageOptionsState {
    page2progressBlocked: boolean
    expiryDate: Date
    lifetime: number
    enableNotifications: boolean
    showAdvanced: boolean
    groupBy: DIDType
    asynchronousMode: boolean
    numcopies: number
    takesamples: boolean
    numsamples: number
    freeComment: string
}

export const CreateRuleOptionsPage = (props:{
    setSummaryViewModel: Dispatch<SetStateAction<RuleSummaryViewModel | undefined>>
    activePage: number
    setActivePage: Dispatch<SetStateAction<number>>
    CreateRulePageProps: CreateRulePageProps
    pagePrevFunction: (event: any) => void
    selectedDIDs : ListDIDsViewModel[]
    RSEsInformation: {
        selectedRSEs: RSEAccountUsageLimitViewModel[];
        askForApproval: boolean;
    }
    setOptions: Dispatch<SetStateAction<{
        lifetime: number;
        expiryDate: Date;
        enableNotifications: boolean;
        asynchronousMode: boolean;
        numcopies: number;
        takesamples: boolean;
        numsamples: number;
        freeComment: string;
        groupBy: DIDType;
    }>>


}) => {
    // set state to store Options page information
    const [PageOptionsState, setPageOptionsState] = useState<PageOptionsState>({
        expiryDate: new Date(2025, 1, 1),
        lifetime: 0,
        takesamples: false,
        numsamples: -1,
        enableNotifications: false,
        showAdvanced: false,
        groupBy: DIDType.DATASET,
        asynchronousMode: false,
        numcopies: 1,
        freeComment: "",
        page2progressBlocked: false,
    })

    // Load the Summary view model
    const loadRuleSummaryPage = () => {
        const fetchSummaryRequest: RuleSummaryViewModel = {
            status: 'success',
            RSEViewModels: props.RSEsInformation.selectedRSEs,
            DIDViewModels: props.selectedDIDs,
            expirydate: PageOptionsState.expiryDate,
            lifetime: PageOptionsState.lifetime,
            notifications: PageOptionsState.enableNotifications,
            asynchronousMode: PageOptionsState.asynchronousMode,
            numcopies: PageOptionsState.numcopies,
            takeSamples: PageOptionsState.takesamples,
            numsamples: PageOptionsState.numsamples,
            groupby: PageOptionsState.groupBy,
            comment: PageOptionsState.freeComment,
            approval: props.RSEsInformation.askForApproval,
            accountInfo: props.CreateRulePageProps.accountInfo,
        }
        console.log(fetchSummaryRequest)
        props.setOptions({
            lifetime: PageOptionsState.lifetime, 
            expiryDate: PageOptionsState.expiryDate,
            enableNotifications: PageOptionsState.enableNotifications,
            asynchronousMode: PageOptionsState.asynchronousMode,
            numcopies: PageOptionsState.numcopies,
            takesamples: PageOptionsState.takesamples,
            numsamples: PageOptionsState.numsamples,
            groupBy: PageOptionsState.groupBy,
            freeComment: PageOptionsState.freeComment,
        })
        props.setSummaryViewModel(fetchSummaryRequest)
        props.setActivePage(3)
    }

    return(
        <>
        <RulePage pagenum={2} allowNext allowPrev activePage={props.activePage} progressBlocked={PageOptionsState.page2progressBlocked} onNext={() => { loadRuleSummaryPage() }} onPrev={props.pagePrevFunction}>
                    <div className="flex md:flex-row md:space-x-2 flex-col space-y-2 m-2">
                        <div className="flex flex-col space-y-2 md:w-60 w-full">
                            <div className="w-full">
                                <Label label="expiryDate">Lifetime and Expiry Date</Label>
                                <LifetimeWithExpirationDateInput
                                    initialdate={PageOptionsState.expiryDate}
                                    placeholder="Rule Expiry Date"
                                    onChange={(date: Date, lifetime: number) => { setPageOptionsState({ ...PageOptionsState, expiryDate: date, lifetime: lifetime }) }}
                                />
                            </div>
                            <div className="w-full">
                                <Label label="numCopies">Number of Copies</Label>
                                <NumInput
                                    value={PageOptionsState.numcopies}
                                    min={1}
                                    onChange={(event: any) => { setPageOptionsState({ ...PageOptionsState, numcopies: event.target.value }) }}
                                    id="numCopies"
                                />
                            </div>
                            <div className="w-full">
                                <Checkbox
                                    type="checkbox"
                                    label="Enable Notifications"
                                    onChange={(event: any) => { setPageOptionsState({ ...PageOptionsState, enableNotifications: event.target.checked }) }}
                                    checked={PageOptionsState.enableNotifications}
                                />
                            </div>
                        </div>
                        <div className="border rounded-md p-2 grow">
                            <div className="flex w-full justify-start space-x-2">
                                <div className="w-24">
                                    <Button label="Advanced" onClick={() => { setPageOptionsState({ ...PageOptionsState, showAdvanced: !PageOptionsState.showAdvanced }) }} />
                                </div>
                                <SamplingTag sampling={PageOptionsState.takesamples} />
                            </div>
                            <Collapsible showIf={PageOptionsState.showAdvanced}>
                                <div className="flex flex-col space-y-2 mt-2">
                                    <div className="w-full">
                                        <label
                                            className="hidden"
                                            htmlFor="item-grouping-dropdown"
                                        >
                                            Item Grouping
                                        </label>
                                        <Dropdown
                                            handleChange={(element: any) => { setPageOptionsState({ ...PageOptionsState, groupBy: element }) }}
                                            id="item-grouping-dropdown"
                                        />
                                    </div>
                                    <div className="">
                                        <Checkbox
                                            type="checkbox"
                                            label="Asynchronous Mode"
                                            onChange={(event: any) => { setPageOptionsState({ ...PageOptionsState, asynchronousMode: event.target.checked }) }}
                                            checked={PageOptionsState.asynchronousMode}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Label label="freecomment">Add free comment</Label>
                                        <AreaInput
                                            id="freecomment"
                                            rows={3}
                                            onChange={(event) => { setPageOptionsState({ ...PageOptionsState, freeComment: event.target.value }); }}
                                            content={PageOptionsState.freeComment}
                                        />
                                    </div>
                                    <div className={twMerge(
                                        "flex flex-col border rounded-sm p-2",
                                        PageOptionsState.takesamples ? "bg-brand-300 dark:bg-brand-600" : "bg-neutral-100 dark:bg-neutral-800"
                                    )}
                                    >
                                        <div
                                            className="flex flex-row justify-start space-x-2"
                                        >
                                            <input
                                                type="checkbox"
                                                className="cursor-pointer"
                                                checked={PageOptionsState.takesamples}
                                                onChange={(event) => {
                                                    if (PageOptionsState.takesamples) {
                                                        setPageOptionsState({ ...PageOptionsState, numsamples: -1, takesamples: false })
                                                    } else {
                                                        setPageOptionsState({ ...PageOptionsState, numsamples: 1, takesamples: true })
                                                    }
                                                }}
                                                id="create-sample"
                                            />
                                            <label
                                                htmlFor="create-sample"
                                                className="text-text-1000 dark:text-text-100"
                                            >
                                                Create Sample
                                            </label>
                                        </div>
                                        <div className="grow flex flex-col justify-end">
                                            <Label label="numSamples">Number of Samples</Label>
                                            <NumInput
                                                value={PageOptionsState.numsamples}
                                                onChange={(event: any) => { setPageOptionsState({ ...PageOptionsState, numsamples: event.target.value }) }}
                                                id="numSamples"
                                                min={1}
                                                disabled={!PageOptionsState.takesamples}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Collapsible>
                        </div>
                    </div>
                </RulePage>
        </>
    )

}
