import { StoryFn, Meta } from '@storybook/react';
import { PageDIDFilereplicas as PDF } from "./PageDIDFilereplicas"
import { ReplicaState } from '@/lib/core/entity/rucio';
import { createFileReplicaState } from 'test/fixtures/table-fixtures';

export default {
    title: "Components/Pages/PageDID",
    component: PDF,
} as Meta<typeof PDF>;

const Template: StoryFn<typeof PDF> = (args) => <PDF {...args} />;

export const PageDIDFilereplicas = Template.bind({});
PageDIDFilereplicas.args = {
    tableData: {
        data: Array.from({length: 100}, (_, i) => createFileReplicaState()),
        pageSize: 10,
        fetchStatus: "idle"
    }
}