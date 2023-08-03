'use client';
import { fixtureOngoingrules, fixtureUsedquota } from "test/fixtures/widget-fixtures";
import { Dashboard as DashboardStory } from "@/component-library/Pages/Dashboard/Dashboard";
import { Role } from "@/lib/core/entity/account";
export default function Page() {
    return (
        <DashboardStory
            accountname="test"
            accountrole={Role.ADMIN}
            inputOngoingrules={Array.from({ length: 20 }, (v, k) => fixtureOngoingrules())}
            inputUsedquota={Array.from({ length: 20 }, (v, k) => fixtureUsedquota())}
        />
    )
}
