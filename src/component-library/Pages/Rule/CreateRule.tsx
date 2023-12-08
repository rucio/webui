import { useEffect, useState } from 'react';
import { Button } from '../../Button/Button';
import { Checkbox } from '../../Button/Checkbox';
import { Timeline } from '../../Misc/Timeline';
import { Collapsible } from '../../Helpers/Collapsible';
import { Tabs } from '../../Misc/Tabs';
import { TextInput } from '../../Input/TextInput';
import { Dropdown } from './GroupingDropdown';
import { RulePage } from './RulePage';
import { DateInput } from '../../Input/DateInput';
import { P } from "../../Text/Content/P";
import { Label } from "../../Text/Content/Label"
import { NumInput } from '../../Input/NumInput';
import { AreaInput } from '../../Input/AreaInput';
import { SummaryPage } from './SummaryPage';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { HTTPRequest } from "@/lib/sdk/http";
import { Heading } from '../Helpers/Heading';
import { Body } from '../Helpers/Body';


/* =================================================
*  Importing Types and Interfaces
*  ================================================= */
import {
    TCreateRuleRequest, CreateRuleResponse, DIDName, TypedDIDValidationQuery,
    TypedDIDValidationResponse,
    TFetchCreateRuleSummaryRequest,

} from '@/lib/infrastructure/data/view-model/create-rule.d';
import { AccountInfo, DIDType } from '@/lib/core/entity/rucio';
import { twMerge } from 'tailwind-merge';
import { SamplingTag } from '../../Tags/SamplingTag';
import { CreateRuleDIDTable } from './CreateRuleDIDTable';
import { didToScopename } from '../../StreamedTables/helpers';
import { CreateRuleRSETable } from './CreateRuleRSETable';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { RuleSummaryViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';

export interface CreateRulePageProps {
    accountInfo: AccountInfo,
    // Page 0.0 - DID Search`
    didListComDOM: UseComDOM<ListDIDsViewModel>,
    // Page 0.1 - DID Validation
    didValidation: (didValidationQuery: TypedDIDValidationQuery) => Promise<TypedDIDValidationResponse>,
    // Page 1 - RSE Selection
    rseListComDOM: UseComDOM<RSEAccountUsageLimitViewModel>,
    // Page 2 - Summary
    fetchSummary: (
        query: TFetchCreateRuleSummaryRequest, 
        setSummaryViewModel: (viewModel: RuleSummaryViewModel) => void, 
        setActivePage: (int: number) => void,
        setError: (error: string) => void,
    ) => void,
    // Page 3 - Sendoff
    onSubmit: (createRuleQuery: TCreateRuleRequest) => Promise<CreateRuleResponse>

}

// can assume that DIDs are unique, hence SET can be used later

interface Page0State {
    page0progressBlocked: boolean

    // Subpage 0: DID Search Pattern
    selectDIDMethod: number
    // selection by search
    selectDIDDataPattern: string
    searchDIDSelection: Array<ListDIDsViewModel>

    // Subpage 1: List of DIDs
    // selection via typing
    typedDIDs: Array<DIDName>
    errorDIDs: TypedDIDValidationResponse // validation of typed DIDs
}

interface Page1State {
    page1progressBlocked: boolean
    RSEExpression: string
    RSESelection: Array<RSEAccountUsageLimitViewModel>
    askForApproval: boolean
}

interface Page2State {
    page2progressBlocked: boolean
    expiryDate: Date
    enableNotifications: boolean
    showAdvanced: boolean
    groupBy: DIDType
    asynchronousMode: boolean
    numcopies: number
    takesamples: boolean
    numsamples: number
    freeComment: string
}

export const CreateRule = (
    props: CreateRulePageProps
) => {
    /* =================================================
    *  Relevant for all pages
    *  ================================================= */
    // state to store active page
    const [activePage, setActivePage] = useState<number>(0)
    const pagePrevFunction = (event: any) => {
        setActivePage(activePage - 1)
    }


    /* =================================================
    *  Page 0
    *  ================================================= */
    // page 0 state
    const [Page0State, setPage0State] = useState<Page0State>({
        selectDIDMethod: 0,
        selectDIDDataPattern: "",
        searchDIDSelection: [],
        typedDIDs: [],
        errorDIDs: { ErrorList: [] },
        page0progressBlocked: true
    })

    useEffect(() => {
        // set page0progressblocked to true if DID selections are empty
        if (Page0State.searchDIDSelection.length === 0 && Page0State.typedDIDs.length === 0) {
            setPage0State({ ...Page0State, page0progressBlocked: true })
        } else {
            setPage0State({ ...Page0State, page0progressBlocked: false })
        }
    }, [Page0State.typedDIDs, Page0State.searchDIDSelection])

    const page0DIDSearch = async (event: any, explicitDIDSearchExpression?: string) => {
        let DIDSearchString = explicitDIDSearchExpression ? explicitDIDSearchExpression : Page0State.selectDIDDataPattern
        // build request for comdom
        const request: HTTPRequest = {
            url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-dids`),
            method: "GET",
            headers: new Headers({
                'Content-Type': 'application/json'
            } as HeadersInit),
            params: {
                query: DIDSearchString,
                type: DIDType.ALL
            },
        }
        // run query
        await props.didListComDOM.setRequest(request)
        await props.didListComDOM.start()
    }

    const page0nextFunction = (event: any) => {
        if (Page0State.typedDIDs.length === 0) {
            // no validation, just next page
            setActivePage(activePage + 1)
            return
        }
        // if typedDIDs is not empty, then we need to validate the DIDs
        var splitDIDs = Page0State.typedDIDs
        const TypedDIDValidationQuery: TypedDIDValidationQuery = {
            DIDList: splitDIDs
        }

        // execute query
        const typedDIDValidationResponse = props.didValidation(TypedDIDValidationQuery)
        typedDIDValidationResponse.then((response) => {
            setPage0State({ ...Page0State, errorDIDs: response })
            setActivePage(activePage + 1)
        })
        typedDIDValidationResponse.catch((error) => {
            setPage0State({ ...Page0State, errorDIDs: error })
        })

        // TODO: display errors in a modal
    }

    /* =================================================
    *  Page 1
    *  ================================================= */
    // page 1 state
    const [Page1State, setPage1State] = useState<Page1State>({
        RSEExpression: "",
        RSESelection: [],
        askForApproval: false,
        page1progressBlocked: true
    })

    useEffect(() => {
        // set page1progressblocked to true if RSESelection is empty
        if (Page1State.RSESelection.length === 0) {
            setPage1State({ ...Page1State, page1progressBlocked: true })
        }
        // set page1progressblocked to true if any selected RSE needs quota and Ask for Approval is not checked
        else if(!Page1State.askForApproval){
            let needsApproval = false
            Page1State.RSESelection.forEach(element => {
                if(!element.has_quota){
                    needsApproval = true
                    return
                }
            });
            if(needsApproval){
                setPage1State({ ...Page1State, page1progressBlocked: true })
            } else {
                setPage1State({ ...Page1State, page1progressBlocked: false })
            }
        } else if(Page1State.askForApproval){
            setPage1State({ ...Page1State, page1progressBlocked: false })
        }
        else {
            setPage1State({ ...Page1State, page1progressBlocked: false })
        }
    }, [Page1State.RSESelection, Page1State.askForApproval])

    const page1RSESearch = async (event: any, explicitRSEExpression?: string) => {
        // sometimes the state has not updated yet, so use explicitly passed RSEExpr
        var RSEExpression = explicitRSEExpression ? explicitRSEExpression : Page1State.RSEExpression
        // build request for comdom
        const request: HTTPRequest = {
            url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-account-rse-quotas`),
            method: "POST",
            headers: new Headers({
                'Content-Type': 'application/json'
            } as HeadersInit),
            body: {
                "requestedDIDs": Page0State.searchDIDSelection,
                "rseExpression": RSEExpression,
            }
        }
        // run query
        await props.rseListComDOM.setRequest(request)
        await props.rseListComDOM.start()
    }

    /* =================================================
    *  Page 2
    *  ================================================= */
    // page 2 state
    const [Page2State, setPage2State] = useState<Page2State>({
        expiryDate: new Date(2025, 1, 1),
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

    /* =================================================
    *  Page 3 : Summary page
    *  ================================================= */
    const [summaryViewModel, setSummaryViewModel] = useState<RuleSummaryViewModel>()

    const loadRuleSummaryPage = () => {
        const fetchSummaryRequest: RuleSummaryViewModel = {
            status: 'success',
            RSEList: Page1State.RSESelection.map((element) => element.rse),
            DIDList: Page0State.typedDIDs.concat(didToScopename(Page0State.searchDIDSelection)),
            RSEViewModels: Page1State.RSESelection,
            DIDViewModels: Page0State.searchDIDSelection,
            expirydate: Page2State.expiryDate,
            notifications: Page2State.enableNotifications,
            asynchronousMode: Page2State.asynchronousMode,
            numcopies: Page2State.numcopies,
            numsamples: Page2State.numsamples,
            groupby: Page2State.groupBy,
            comment: Page2State.freeComment,
            approval: Page1State.askForApproval,
            accountInfo: props.accountInfo,
        }
        setSummaryViewModel(fetchSummaryRequest)
        setActivePage(3)
        // props.fetchSummary(fetchSummaryRequest, setSummaryViewModel, setActivePage, (error: string) => { console.log(error) })        
    }

    
    
    const page3submitFunction = (event: any) => {
        // execute query
        // TODO : Use summary view model to create the query
        const createRulesRequest: TCreateRuleRequest = {
            DIDList: Page0State.typedDIDs.concat(didToScopename(Page0State.searchDIDSelection)),
            RSEList: Page1State.RSESelection.map((element) => element.rse),
            RSEViewModels: Page1State.RSESelection,
            DIDViewModels: Page0State.searchDIDSelection,
            expirydate: Page2State.expiryDate,
            notifications: Page2State.enableNotifications,
            asynchronousMode: Page2State.asynchronousMode,
            numcopies: Page2State.numcopies,
            numsamples: Page2State.numsamples,
            groupby: Page2State.groupBy,
            comment: Page2State.freeComment,
            approval: Page1State.askForApproval
        }
        const response = props.onSubmit(createRulesRequest)
        response.then((response) => {
            console.log("response: ", response)
        })
    }

    /* =================================================
    *  Building the page
    *  ================================================= */
    return (
        <div
            data-testid="create-rule-root"
            className={twMerge(
                "flex flex-col space-y-2 w-full"
            )}
        >
            <Heading
                title="Create Rule"
            >
                <Timeline
                    steps={["DIDs", "RSEs", "Options", "Summary"]}
                    active={activePage}
                    onJump={(goal: number) => { setActivePage(goal) }}
                />
            </Heading>
            <Body>
                <RulePage pagenum={0} activePage={activePage} progressBlocked={Page0State.page0progressBlocked} onNext={(event: any) => { page0nextFunction(event) }} onPrev={pagePrevFunction}>
                    <Tabs
                        tabs={["DID Search Pattern", "List of DIDs"]}
                        active={Page0State.selectDIDMethod}
                        updateActive={(active: number) => { setPage0State({ ...Page0State, selectDIDMethod: active }) }}
                    />
                    <Collapsible showIf={Page0State.selectDIDMethod === 0}>
                        <div className="flex flex-col space-y-2 m-2">
                            <div className="flex flex-col sm:flex-row sm:items-end w-full space-y-2 sm:space-x-2">
                                <label className='w-fit' htmlFor='did-search-pattern'><P>DID Search Pattern</P></label>
                                <div className='grow'>
                                    <TextInput
                                        onBlur={(event: any) => { setPage0State({ ...Page0State, selectDIDDataPattern: event.target.value }) }}
                                        onEnterkey={(event: any) => { setPage0State({ ...Page0State, selectDIDDataPattern: event.target.value }); page0DIDSearch(event.target.value, event.target.value) }}
                                        id="did-search-pattern"
                                    />
                                </div>
                                <div className="w-full sm:w-24 sm:grow-0">
                                    <Button type="submit" label="Search" onClick={page0DIDSearch} id="page0-search" />
                                </div>
                            </div>
                            <CreateRuleDIDTable
                                comdom={props.didListComDOM}
                                handleChange={(data: ListDIDsViewModel[]) => { setPage0State({ ...Page0State, searchDIDSelection: data }) }}
                            />
                        </div>
                    </Collapsible>
                    <Collapsible showIf={Page0State.selectDIDMethod === 1}>
                        {/* TODO: Beta */}
                        <div className="flex flex-col space-y-2 m-2">
                            <Label label="dids">This feature will be released soon!</Label>
                            {/* <Label label="dids">Data Identifiers to select:</Label>
                            <ListInput
                                id="dids"
                                onAdd={(value: string) => {
                                    setPage0State({ ...Page0State, typedDIDs: Page0State.typedDIDs.concat(value) })
                                }}
                                onRemove={(value: string) => {
                                    setPage0State({ ...Page0State, typedDIDs: Page0State.typedDIDs.filter((item) => item !== value) })
                                }}
                                value={Page0State.typedDIDs}
                                placeholder="Type your DIDs here"
                            />
                            <label htmlFor="didErrors">Errors:</label>
                            <div
                                id="didErrors"
                                className="h-24 overflow-y-auto w-full border rounded-md p-2 dark:text-white dark:border-2"
                            >
                                <Collapsible showIf={Page0State.errorDIDs.ErrorList.length === 0}>
                                    <p className="font-mono">{"Validate DIDs by pressing \"Next\"."}</p>
                                </Collapsible>
                                {Page0State.errorDIDs.ErrorList.map((element, index) => {
                                    return (
                                        <P mono key={index}>DID {element.DID} has Errorcodes {element.ErrorCodes}</P>
                                    )
                                })}
                            </div> */}
                        </div>
                    </Collapsible>
                </RulePage>
                <RulePage pagenum={1} activePage={activePage} progressBlocked={Page1State.page1progressBlocked} onNext={() => { setActivePage(activePage + 1) }} onPrev={pagePrevFunction}>
                    <div className="flex flex-col space-y-2 m-2">
                        <div className="flex w-full flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                            <label className="-mb-2 sm:mt-2.5 sm:w-36" htmlFor='rse-expression'><P>RSE Expression</P></label>
                            <div className="grow">
                                <TextInput
                                    id='rse-expression'
                                    onBlur={(event) => { setPage1State({ ...Page1State, RSEExpression: event.target.value }) }}
                                    onEnterkey={(event) => { setPage1State({ ...Page1State, RSEExpression: event.target.value }); page1RSESearch(event, event.target.value); }}
                                />
                            </div>
                            <div className="w-full sm:w-24">
                                <Button type="submit" label="Search" onClick={page1RSESearch} />
                            </div>
                        </div>
                        <CreateRuleRSETable
                            comdom={props.rseListComDOM}
                            handleChange={(data: RSEAccountUsageLimitViewModel[]) => { setPage1State({ ...Page1State, RSESelection: data }) }}
                            askApproval={Page1State.askForApproval}
                        />
                        <div>
                            <Checkbox
                                label="Ask for Approval"
                                type="checkbox"
                                onChange={(event: any) => { setPage1State({ ...Page1State, askForApproval: event.target.checked }) }}
                                checked={Page1State.askForApproval}
                            />
                        </div>
                    </div>
                </RulePage>
                <RulePage pagenum={2} activePage={activePage} progressBlocked={Page2State.page2progressBlocked} onNext={() => { loadRuleSummaryPage() }} onPrev={pagePrevFunction}>
                    <div className="flex md:flex-row md:space-x-2 flex-col space-y-2 m-2">
                        <div className="flex flex-col space-y-2 md:w-60 w-full">
                            <div className="w-full">
                                <Label label="expiryDate">Expiry Date</Label>
                                <DateInput
                                    initialdate={Page2State.expiryDate}
                                    placeholder="Rule Expiry Date"
                                    onchange={(date: Date) => { setPage2State({ ...Page2State, expiryDate: date }) }}
                                    id="expiryDate"
                                />
                            </div>
                            <div className="w-full">
                                <Label label="numCopies">Number of Copies</Label>
                                <NumInput
                                    value={Page2State.numcopies}
                                    min={1}
                                    onChange={(event: any) => { setPage2State({ ...Page2State, numcopies: event.target.value }) }}
                                    id="numCopies"
                                />
                            </div>
                            <div className="w-full">
                                <Checkbox
                                    type="checkbox"
                                    label="Enable Notifications"
                                    onChange={(event: any) => { setPage2State({ ...Page2State, enableNotifications: event.target.checked }) }}
                                    checked={Page2State.enableNotifications}
                                />
                            </div>
                        </div>
                        <div className="border rounded-md p-2 grow">
                            <div className="flex w-full justify-start space-x-2">
                                <div className="w-24">
                                    <Button label="Advanced" onClick={() => { setPage2State({ ...Page2State, showAdvanced: !Page2State.showAdvanced }) }} />
                                </div>
                                <SamplingTag sampling={Page2State.takesamples} />
                            </div>
                            <Collapsible showIf={Page2State.showAdvanced}>
                                <div className="flex flex-col space-y-2 mt-2">
                                    <div className="w-full">
                                        <label
                                            className="hidden"
                                            htmlFor="item-grouping-dropdown"
                                        >
                                            Item Grouping
                                        </label>
                                        <Dropdown
                                            handleChange={(element: any) => { setPage2State({ ...Page2State, groupBy: element }) }}
                                            id="item-grouping-dropdown"
                                        />
                                    </div>
                                    <div className="">
                                        <Checkbox
                                            type="checkbox"
                                            label="Asynchronous Mode"
                                            onChange={(event: any) => { setPage2State({ ...Page2State, asynchronousMode: event.target.checked }) }}
                                            checked={Page2State.asynchronousMode}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Label label="freecomment">Add free comment</Label>
                                        <AreaInput
                                            id="freecomment"
                                            rows={3}
                                            onChange={(event) => { setPage2State({ ...Page2State, freeComment: event.target.value }); }}
                                            content={Page2State.freeComment}
                                        />
                                    </div>
                                    <div className={twMerge(
                                        "flex flex-col border rounded-sm p-2",
                                        Page2State.takesamples ? "bg-teal-300 dark:bg-teal-600" : "bg-gray-100 dark:bg-gray-800"
                                    )}
                                    >
                                        <div
                                            className="flex flex-row justify-start space-x-2"
                                        >
                                            <input
                                                type="checkbox"
                                                className="cursor-pointer"
                                                checked={Page2State.takesamples}
                                                onChange={(event) => {
                                                    if (Page2State.takesamples) {
                                                        setPage2State({ ...Page2State, numsamples: -1, takesamples: false })
                                                    } else {
                                                        setPage2State({ ...Page2State, numsamples: 1, takesamples: true })
                                                    }
                                                }}
                                                id="create-sample"
                                            />
                                            <label
                                                htmlFor="create-sample"
                                                className="text-black dark:text-gray-100"
                                            >
                                                Create Sample
                                            </label>
                                        </div>
                                        <div className="grow flex flex-col justify-end">
                                            <Label label="numSamples">Number of Samples</Label>
                                            <NumInput
                                                value={Page2State.numsamples}
                                                onChange={(event: any) => { setPage2State({ ...Page2State, numsamples: event.target.value }) }}
                                                id="numSamples"
                                                min={1}
                                                disabled={!Page2State.takesamples}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Collapsible>
                        </div>
                    </div>
                </RulePage>
                <RulePage pagenum={3} activePage={activePage} onNext={page3submitFunction} onPrev={pagePrevFunction} submit>
                    <SummaryPage data={summaryViewModel? summaryViewModel : {
                        status: 'error',
                        message: 'Please check your inputs on previous pages! Cannot retrieve summary from the server',
                        DIDList: [],
                        RSEList: [],
                        RSEViewModels: [],
                        DIDViewModels: [],
                        expirydate: new Date(2025, 1, 1),
                        notifications: false,
                        asynchronousMode: false,
                        numcopies: 0,
                        numsamples: 0,
                        groupby: DIDType.UNKNOWN,
                        comment: '',
                        approval: false,
                        accountInfo: props.accountInfo,
                    }} />
                </RulePage>
            </Body>
        </div>
    )
}
