import { StoryFn, Meta } from '@storybook/react';
import { PageDIDFilereplicasD as PDFD } from "./PageDIDFilereplicasD"
import { ReplicaState } from '@/lib/core/entity/rucio';

export default {
    title: "Components/Pages/PageDID",
    component: PDFD,
} as Meta<typeof PDFD>;

const Template: StoryFn<typeof PDFD> = (args) => <PDFD {...args} />;

export const PageDIDFilereplicasD = Template.bind({});
PageDIDFilereplicasD.args = {
    replicaTableData: {
        data: [
            { rse: "FRESNO-AWS_SCRATCHDISK", state: ReplicaState.Available },
            { rse: "PRAGUELCG2_SCRATCHDISK", state: ReplicaState.Unavailable },
            { rse: "BNL-OSG2_SCRATCHDISK", state: ReplicaState.Copying },
            { rse: "BNL-OSG2_SCRATCHDISK", state: ReplicaState.Being_Deleted },
            { rse: "BNL-OSG2_SCRATCHDISK", state: ReplicaState.Bad },
            { rse: "BNL-OSG2_SCRATCHDISK", state: ReplicaState.Temporary_Unavailable },
        ],
        pageSize: 10,
        fetchStatus: "idle",
    },
    datasetTableData: {
        data: [
            { scope: "mc16_13TeV", name: "DAOD_EXOT12.123456784", available: 1, unavailable: 0, copying: 0, being_deleted: 0, bad: 0, temporary_unavailable: 0 },
            { scope: "mc16_14TeV", name: "DAOD_EXOT12.123456749", available: 1, unavailable: 1, copying: 0, being_deleted: 0, bad: 2, temporary_unavailable: 0 },
            { scope: "mc16_15TeV", name: "DAOD_EXOT12.123456791", available: 0, unavailable: 0, copying: 0, being_deleted: 0, bad: 2, temporary_unavailable: 1 },
            { scope: "mc15_16TeV", name: "DAOD_EXOT12.123456811", available: 3, unavailable: 0, copying: 1, being_deleted: 1, bad: 0, temporary_unavailable: 0 },
        ],
        pageSize: 10,
        fetchStatus: "idle",
    },
    onChangeDatasetSelection: (dataset: string) => console.log("onChangeDatasetSelection", dataset),
}