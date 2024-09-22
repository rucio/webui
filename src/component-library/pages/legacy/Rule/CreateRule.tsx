import { useState } from 'react';
import { Timeline } from '../../../atoms/legacy/Timeline/Timeline';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { Heading } from '@/component-library/pages/legacy/Helpers/Heading';
import { Body } from '@/component-library/pages/legacy/Helpers/Body';

/* =================================================
 *  Importing Types and Interfaces
 *  ================================================= */
import { TypedDIDValidationQuery, TypedDIDValidationResponse, CreateRulesViewModel } from '@/lib/infrastructure/data/view-model/create-rule';
import { AccountInfo, DIDType } from '@/lib/core/entity/rucio';
import { twMerge } from 'tailwind-merge';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { RuleSummaryViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { TCreateRuleFeatureRequestParams } from '@/pages/api/feature/create-rule';
import { CreateRuleDIDsPage } from './1_DIDs/CreateRuleDIDsPage';
import { CreateRuleRSEsPage } from './2_RSEs/CreateRuleRSEsPage';
import { CreateRuleOptionsPage } from './3_Options/CreateRuleOptionsPage';
import { CreateRuleSummaryPage } from './4_Summary/CreateRuleSummaryPage';
import { CreateRuleStatusTabPage } from './5_Status/CreateRuleStatusTabPage';

export interface CreateRulePageProps {
    accountInfo: AccountInfo;
    // Page 0.0 - DID Search`
    didListComDOM: UseComDOM<ListDIDsViewModel>;
    // Page 0.1 - DID Validation
    didValidation: (didValidationQuery: TypedDIDValidationQuery) => Promise<TypedDIDValidationResponse>;
    // Page 1 - RSE Selection
    rseListComDOM: UseComDOM<RSEAccountUsageLimitViewModel>;
    // Page 3 - Sendoff
    onSubmit: (createRuleQuery: TCreateRuleFeatureRequestParams) => Promise<CreateRulesViewModel>;
}

interface QueryResults extends CreateRulesViewModel {}

export const CreateRule = (props: CreateRulePageProps) => {
    /* =================================================
     *  Relevant for the CreateRule page
     *  ================================================= */

    // state to store active page
    const [activePage, setActivePage] = useState<number>(0);
    const pagePrevFunction = (event: any) => {
        setActivePage(activePage - 1);
    };

    // state to store the selected DIDs
    const [selectedDIDs, setSelectedDID] = useState<Array<ListDIDsViewModel>>([]);

    // state to store the RSE Information : the selected RSEs and if the user asks for approval
    const [RSEsInformation, setRSEsInformation] = useState<{
        selectedRSEs: RSEAccountUsageLimitViewModel[];
        askForApproval: boolean;
    }>({
        selectedRSEs: [],
        askForApproval: false,
    });

    // state to store the options
    const [Options, setOptions] = useState<{
        lifetime: number;
        expiryDate: Date;
        enableNotifications: boolean;
        asynchronousMode: boolean;
        numcopies: number;
        takesamples: boolean;
        numsamples: number;
        freeComment: string;
        groupBy: DIDType;
    }>({
        expiryDate: new Date(2025, 1, 1),
        lifetime: 0,
        takesamples: false,
        numsamples: -1,
        enableNotifications: false,
        groupBy: DIDType.DATASET,
        asynchronousMode: false,
        numcopies: 1,
        freeComment: '',
    });

    // state to store the summary view model
    const [summaryViewModel, setSummaryViewModel] = useState<RuleSummaryViewModel>();

    // state to store query results
    const [QueryResults, setQueryResults] = useState<QueryResults>({
        status: 'pending',
        rules: [],
    });

    /* =================================================
     *  Building the page
     *  ================================================= */
    return (
        <div data-testid="create-rule-root" className={twMerge('flex flex-col space-y-2 w-full')}>
            <Heading title="Create Rule">
                <Timeline
                    steps={['DIDs', 'RSEs', 'Options', 'Summary', 'Status']}
                    active={activePage}
                    onJump={(goal: number) => {
                        setActivePage(goal);
                    }}
                />
            </Heading>
            <Body>
                <CreateRuleDIDsPage
                    setDIDS={setSelectedDID}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    CreateRulePageProps={props}
                    pagePrevFunction={pagePrevFunction}
                ></CreateRuleDIDsPage>

                <CreateRuleRSEsPage
                    setRses={setRSEsInformation}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    CreateRulePageProps={props}
                    pagePrevFunction={pagePrevFunction}
                    selectedDIDs={selectedDIDs}
                ></CreateRuleRSEsPage>

                <CreateRuleOptionsPage
                    setOptions={setOptions}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    CreateRulePageProps={props}
                    pagePrevFunction={pagePrevFunction}
                    selectedDIDs={selectedDIDs}
                    RSEsInformation={RSEsInformation}
                    setSummaryViewModel={setSummaryViewModel}
                ></CreateRuleOptionsPage>

                <CreateRuleSummaryPage
                    activePage={activePage}
                    setActivePage={setActivePage}
                    CreateRulePageProps={props}
                    pagePrevFunction={pagePrevFunction}
                    selectedDIDs={selectedDIDs}
                    RSEsInformation={RSEsInformation}
                    summaryViewModel={summaryViewModel}
                    setQueryResults={setQueryResults}
                    Options={Options}
                ></CreateRuleSummaryPage>

                <CreateRuleStatusTabPage
                    activePage={activePage}
                    QueryStatus={QueryResults}
                    pagePrevFunction={pagePrevFunction}
                ></CreateRuleStatusTabPage>
            </Body>
        </div>
    );
};
