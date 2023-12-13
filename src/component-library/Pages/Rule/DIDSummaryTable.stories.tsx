import { AccountStatus, AccountType, DIDType } from "@/lib/core/entity/rucio";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";
import { Meta, StoryFn } from "@storybook/react";
import { DIDSummaryTable } from "./DIDSummaryTable";

export default {
    title: 'Pages/Rule/CreateRule/DIDSummaryTable',
    component: DIDSummaryTable,
} as Meta<typeof DIDSummaryTable>;

const template: StoryFn<typeof DIDSummaryTable> = (args) => <DIDSummaryTable {...args} />;

export const DIDSummaryTableStory = template.bind({});

DIDSummaryTableStory.args = {
    numSamples: 1,
    takeSamples: false,
    accountInfo: {
        account: "test",
        accountType: AccountType.USER,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        email: "",
    },
    numcopies: 1,
    userAskedForApproval: false,
    listDIDViewModels: [
        {
            "status": "success",
            "scope": "test",
            "name": "test",
            "did_type": DIDType.DATASET,
            "bytes": 123123123123,
            "length": 4,
            "open": false,
        } as ListDIDsViewModel
    ]
}