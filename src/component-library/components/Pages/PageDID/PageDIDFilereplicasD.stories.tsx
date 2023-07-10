import { StoryFn, Meta } from '@storybook/react';
import { PageDIDFilereplicasD as PDFD } from "./PageDIDFilereplicasD"
import { ReplicaState } from '@/lib/core/entity/rucio';
import { createFileReplicaState, createFileReplicaStateD, mockUseComDOM } from 'test/fixtures/table-fixtures';

export default {
    title: "Components/Pages/PageDID",
    component: PDFD,
} as Meta<typeof PDFD>;

const Template: StoryFn<typeof PDFD> = (args) => <PDFD {...args} />;

export const PageDIDFilereplicasD = Template.bind({});
PageDIDFilereplicasD.args = {
    replicaComDOM: mockUseComDOM(Array.from({length: 100}, (_, i) => createFileReplicaState())),
    datasetComDOM: mockUseComDOM(Array.from({length: 100}, (_, i) => createFileReplicaStateD())),
    onChangeDatasetSelection: (dataset: string) => console.log("onChangeDatasetSelection", dataset),
}