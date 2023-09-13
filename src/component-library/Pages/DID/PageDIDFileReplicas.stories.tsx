import { StoryFn, Meta } from '@storybook/react';
import { PageDIDFilereplicas as PDF } from "./PageDIDFileReplicas"
import { ReplicaState } from '@/lib/core/entity/rucio';
import { fixtureFilereplicaStateViewModel, mockUseComDOM } from 'test/fixtures/table-fixtures';

export default {
    title: "Components/Pages/DID",
    component: PDF,
} as Meta<typeof PDF>;

const Template: StoryFn<typeof PDF> = (args) => <PDF {...args} />;

export const PageDIDFilereplicas = Template.bind({});
PageDIDFilereplicas.args = {
    comdom: mockUseComDOM(Array.from({length: 100}, (_, i) => fixtureFilereplicaStateViewModel()))
}