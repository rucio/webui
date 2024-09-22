'use client';
import { PageRule as PageRuleStory } from '@/component-library/pages/legacy/Rule/PageRule';
import { fixtureRuleMetaViewModel } from 'test/fixtures/table-fixtures';
import { useState, useEffect } from 'react';
import useComDOM from '@/lib/infrastructure/hooks/useComDOM';
import { HTTPRequest } from '@/lib/sdk/http';
import { RuleMetaViewModel, RulePageLockEntryViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { getSiteHeader } from '@/app/(rucio)/queries';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';

export default function PageRule({ params }: { params: { id: string } }) {
    const comDOM = useComDOM<RulePageLockEntryViewModel>('rule-page-lock-query', [], false, Infinity, 50, true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    useEffect(() => {
        getSiteHeader().then((vm: SiteHeaderViewModel) => setIsAdmin(vm.activeAccount?.role === 'admin'));
    }, []);
    const [meta, setMeta] = useState<RuleMetaViewModel>({} as RuleMetaViewModel);

    useEffect(() => {
        // TODO get from mock endpoint
        fetch(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/mock-get-rule-meta`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error(res.statusText);
            })
            .then(data => {
                setMeta({ ...data, id: params.id });
            })
            .catch(err => {
                console.error(err);
            });
        // setMeta({ ...fixtureRuleMetaViewModel(), id: params.id })
    }, []);

    useEffect(() => {
        const runQuery = async () => {
            const request: HTTPRequest = {
                url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/mock-list-rule-page-lock`),
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            };
            await comDOM.setRequest(request);
        };
        runQuery();
    }, []);
    return (
        <PageRuleStory
            ruleMeta={meta}
            ruleLocks={comDOM}
            ruleBoostFunc={() => {
                console.log('boost not implemented');
            }}
            ruleBoostShow={isAdmin}
        />
    );
}
