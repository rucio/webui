'use client';
import { fixtureOngoingrules, fixtureUsedquota } from 'test/fixtures/widget-fixtures';
import { Dashboard as DashboardStory } from '@/component-library/pages/legacy/Dashboard/Dashboard';
import { Role } from '@/lib/core/entity/account';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { useEffect, useState } from 'react';
import { getSiteHeader } from '../queries';
import { Loading } from '@/component-library/pages/legacy/Helpers/Loading';
import { User } from '@/lib/core/entity/auth-models';
export default function Page() {
    const [siteHeader, setSiteHeader] = useState<SiteHeaderViewModel>({ status: 'pending' } as SiteHeaderViewModel);
    useEffect(() => {
        getSiteHeader().then((vm: SiteHeaderViewModel) => setSiteHeader(vm));
    }, []);
    if (siteHeader.status === 'pending') return <Loading title="Dashboard" />;
    return (
        <DashboardStory
            accountname={(siteHeader.activeAccount as User).rucioAccount}
            accountrole={(siteHeader.activeAccount as User).role === 'admin' ? Role.ADMIN : Role.USER}
            inputOngoingrules={Array.from({ length: 20 }, (v, k) => fixtureOngoingrules())}
            inputUsedquota={Array.from({ length: 20 }, (v, k) => fixtureUsedquota())}
        />
    );
}
