import { StoryFn, Meta } from '@storybook/react';
import { PageDIDFilereplicasD as PDFD } from "./PageDIDFilereplicasD"

export default {
    title: "Components/Pages/PageDID",
    component: PDFD,
} as Meta<typeof PDFD>;

const Template: StoryFn<typeof PDFD> = (args) => <PDFD {...args} />;

export const PageDIDFilereplicasD = Template.bind({});
PageDIDFilereplicasD.args = {
    replicaTableData: {
        data: [
            { rse: "FRESNO-AWS_SCRATCHDISK", state: "Available" },
            { rse: "PRAGUELCG2_SCRATCHDISK", state: "Unavailable" },
            { rse: "BNL-OSG2_SCRATCHDISK", state: "Copying" },
            { rse: "BNL-OSG2_SCRATCHDISK", state: "Being_Deleted" },
            { rse: "BNL-OSG2_SCRATCHDISK", state: "Bad" },
            { rse: "BNL-OSG2_SCRATCHDISK", state: "Temporary_Unavailable" },
        ],
        pageSize: 10,
        fetchStatus: "idle",
    },
    datasetTableData: {
        data: [
            { scope: "mc16_13TeV", name: "DAOD_EXOT12.123456784", Available: 1, Unavailable: 0, Copying: 0, Being_Deleted: 0, Bad: 0, Temporary_Unavailable: 0 },
            { scope: "mc16_14TeV", name: "DAOD_EXOT12.123456749", Available: 1, Unavailable: 1, Copying: 0, Being_Deleted: 0, Bad: 2, Temporary_Unavailable: 0 },
            { scope: "mc16_15TeV", name: "DAOD_EXOT12.123456791", Available: 0, Unavailable: 0, Copying: 0, Being_Deleted: 0, Bad: 2, Temporary_Unavailable: 1 },
            { scope: "mc15_16TeV", name: "DAOD_EXOT12.123456811", Available: 3, Unavailable: 0, Copying: 1, Being_Deleted: 1, Bad: 0, Temporary_Unavailable: 0 },
        ],
        pageSize: 10,
        fetchStatus: "idle",
    },
    onChangeDatasetSelection: (dataset: string) => console.log("onChangeDatasetSelection", dataset),
}