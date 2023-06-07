import { StoryFn, Meta } from '@storybook/react';
import { PageDIDFilereplicasD as PDFD } from "./PageDIDFilereplicasD"
import { ReplicaState } from '@/lib/core/entity/rucio';
import { createFileReplicaState, createFileReplicaStateD } from 'test/fixtures/table-fixtures';

export default {
    title: "Components/Pages/PageDID",
    component: PDFD,
} as Meta<typeof PDFD>;

const Template: StoryFn<typeof PDFD> = (args) => <PDFD {...args} />;

export const PageDIDFilereplicasD = Template.bind({});
PageDIDFilereplicasD.args = {
    replicaTableData: {
        data: Array.from({length: 100}, (_, i) => createFileReplicaState()),
        pageSize: 10,
        fetchStatus: "idle",
    },
    datasetTableData: {
        data: Array.from({length: 100}, (_, i) => createFileReplicaStateD()),
        pageSize: 10,
        fetchStatus: "idle",
    },
    onChangeDatasetSelection: (dataset: string) => console.log("onChangeDatasetSelection", dataset),
}