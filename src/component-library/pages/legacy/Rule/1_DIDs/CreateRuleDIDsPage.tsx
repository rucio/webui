import { Button } from '@/component-library/atoms/legacy/Button/Button';
import { Collapsible } from '@/component-library/atoms/legacy/helpers/Collapsible/Collapsible';
import { TextInput } from '@/component-library/atoms/legacy/input/TextInput/TextInput';
import { Tabs } from '@/component-library/atoms/legacy/Tabs/Tabs';
import { Label } from '@/component-library/atoms/legacy/text/content/Label/Label';
import { P } from '@/component-library/atoms/legacy/text/content/P/P';
import { DIDName, TypedDIDValidationResponse, TypedDIDValidationQuery } from '@/lib/infrastructure/data/view-model/create-rule';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { CreateRuleDIDTable } from './CreateRuleDIDTable';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { HTTPRequest } from '@/lib/sdk/http';
import { DIDType } from '@/lib/core/entity/rucio';
import { RulePage } from '../RulePage';
import { CreateRulePageProps } from '../CreateRule';

interface PageDIDsStateType {
    page0progressBlocked: boolean;

    // Subpage 0: DID Search Pattern
    selectDIDMethod: number;
    // selection by search
    selectDIDDataPattern: string;
    searchDIDSelection: Array<ListDIDsViewModel>;

    // Subpage 1: List of DIDs
    // selection via typing
    typedDIDs: Array<DIDName>;
    errorDIDs: TypedDIDValidationResponse; // validation of typed DIDs
}

export const CreateRuleDIDsPage = (props: {
    setDIDS: any;
    activePage: number;
    setActivePage: Dispatch<SetStateAction<number>>;
    CreateRulePageProps: CreateRulePageProps;
    pagePrevFunction: (event: any) => void;
}) => {
    // set state to store the DID page information
    const [PageDIDsState, setPageDIDsState] = useState<PageDIDsStateType>({
        selectDIDMethod: 0,
        selectDIDDataPattern: '',
        searchDIDSelection: [],
        typedDIDs: [],
        errorDIDs: { ErrorList: [] },
        page0progressBlocked: true,
    });

    useEffect(() => {
        // set page0progressblocked to true if DID selections are empty
        if (PageDIDsState.searchDIDSelection.length === 0 && PageDIDsState.typedDIDs.length === 0) {
            setPageDIDsState({ ...PageDIDsState, page0progressBlocked: true });
        } else {
            setPageDIDsState({ ...PageDIDsState, page0progressBlocked: false });
        }
    }, [PageDIDsState.typedDIDs, PageDIDsState.searchDIDSelection]);

    const pageDIDsSearch = async (event: any, explicitDIDSearchExpression?: string) => {
        let DIDSearchString = explicitDIDSearchExpression ? explicitDIDSearchExpression : PageDIDsState.selectDIDDataPattern;
        // build request for comdom
        const request: HTTPRequest = {
            url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-dids`),
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
            } as HeadersInit),
            params: {
                query: DIDSearchString,
                type: DIDType.ALL,
            },
        };
        // run query
        await props.CreateRulePageProps.didListComDOM.setRequest(request);
        await props.CreateRulePageProps.didListComDOM.start();
    };

    const pageDIDsnextFunction = (event: any) => {
        if (PageDIDsState.typedDIDs.length === 0) {
            // no validation, just next page
            props.setDIDS(PageDIDsState.searchDIDSelection);
            props.setActivePage(props.activePage + 1);
            return;
        }
        // if typedDIDs is not empty, then we need to validate the DIDs
        var splitDIDs = PageDIDsState.typedDIDs;
        const TypedDIDValidationQuery: TypedDIDValidationQuery = {
            DIDList: splitDIDs,
        };

        // execute query
        const typedDIDValidationResponse = props.CreateRulePageProps.didValidation(TypedDIDValidationQuery);
        typedDIDValidationResponse.then(response => {
            setPageDIDsState({ ...PageDIDsState, errorDIDs: response });
            // need to implement a transformation to list of long dids to set in the props.setDIDS()
            props.setActivePage(props.activePage + 1);
        });
        typedDIDValidationResponse.catch(error => {
            setPageDIDsState({ ...PageDIDsState, errorDIDs: error });
        });
    };

    return (
        <>
            <RulePage
                pagenum={0}
                allowNext={true}
                allowPrev={false}
                activePage={props.activePage}
                progressBlocked={PageDIDsState.page0progressBlocked}
                onNext={(event: any) => {
                    pageDIDsnextFunction(event);
                }}
                onPrev={props.pagePrevFunction}
            >
                <Tabs
                    tabs={['DID Search Pattern', 'List of DIDs']}
                    active={PageDIDsState.selectDIDMethod}
                    updateActive={(active: number) => {
                        setPageDIDsState({
                            ...PageDIDsState,
                            selectDIDMethod: active,
                        });
                    }}
                />
                <Collapsible showIf={PageDIDsState.selectDIDMethod === 0}>
                    <div className="flex flex-col space-y-2 m-2">
                        <div className="flex flex-col sm:flex-row sm:items-end w-full space-y-2 sm:space-x-2">
                            <label className="w-fit" htmlFor="did-search-pattern">
                                <P>DID Search Pattern</P>
                            </label>
                            <div className="grow">
                                <TextInput
                                    onBlur={(event: any) => {
                                        setPageDIDsState({
                                            ...PageDIDsState,
                                            selectDIDDataPattern: event.target.value,
                                        });
                                    }}
                                    onEnterkey={(event: any) => {
                                        setPageDIDsState({
                                            ...PageDIDsState,
                                            selectDIDDataPattern: event.target.value,
                                        });
                                        pageDIDsSearch(event.target.value, event.target.value);
                                    }}
                                    id="did-search-pattern"
                                />
                            </div>
                            <div className="w-full sm:w-24 sm:grow-0">
                                <Button type="submit" label="Search" onClick={pageDIDsSearch} id="page0-search" />
                            </div>
                        </div>
                        <CreateRuleDIDTable
                            comdom={props.CreateRulePageProps.didListComDOM}
                            handleChange={(data: ListDIDsViewModel[]) => {
                                setPageDIDsState({
                                    ...PageDIDsState,
                                    searchDIDSelection: data,
                                });
                            }}
                        />
                    </div>
                </Collapsible>
                <Collapsible showIf={PageDIDsState.selectDIDMethod === 1}>
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
        </>
    );
};
