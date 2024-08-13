import React, { useState } from "react"
import { Layout } from '@/component-library/Pages/Layout/Layout';
import { useQuery } from "@tanstack/react-query";
import { SiteHeaderViewModel } from "@/lib/infrastructure/data/view-model/site-header";
import { User } from "@/lib/core/entity/auth-models";

export interface QueryContextLayoutProps {
    children: React.ReactNode;

}
export const RucioAppLayout = (props: QueryContextLayoutProps) => {
    const [siteHeaderViewModel, setSiteHeaderViewModel] = useState<SiteHeaderViewModel>({
        status: "error",
        homeUrl: ""
    })
    const fetchAccounts = async () => {
        await fetch('/api/feature/get-site-header')
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw new Error(res.statusText)
        })
        .then(viewModel => {
            setSiteHeaderViewModel(viewModel as SiteHeaderViewModel)
        })
        .catch(error => {
            // do sth with error
            console.error("Error fetching data:", error);
        })
    }
    
    const fetchAccountKey = ['fetchAccounts']
    useQuery(fetchAccountKey,fetchAccounts)
    return (
            <Layout
            LVM={{
                accountActive: siteHeaderViewModel.activeAccount?.rucioAccount ?? "",
                accountsPossible: siteHeaderViewModel.availableAccounts?.map((user: User) => { return user.rucioAccount}) ?? [],
                rucioProjectLink: "rucio.cern.ch",
                experimentProjectLink: "atlas.cern",
            }}
            >
                {props.children}
            </Layout>
    )
}
