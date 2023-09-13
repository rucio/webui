import { StoryFn, Meta } from '@storybook/react';
import { PageDIDFilereplicasD as PDFD } from "./PageDIDFilereplicasD"
import { fixtureFilereplicaStateViewModel, fixtureFilereplicaStateDViewModel, mockUseComDOM, fixtureDIDViewModel } from 'test/fixtures/table-fixtures';
import { useEffect, useState } from 'react';

export default {
    title: "Components/Pages/DID",
    component: PDFD,
} as Meta<typeof PDFD>;

const Template: StoryFn<typeof PDFD> = (args) => <PDFD {...args} />;


export const PageDIDFilereplicasD = Template.bind({});
PageDIDFilereplicasD.args = {
    datasetComDOM: mockUseComDOM(Array.from({length: 100}, (_, i) => fixtureDIDViewModel())),
    replicaComDOM: mockUseComDOM(Array.from({length: 100}, (_, i) => fixtureFilereplicaStateViewModel())),
    onChangeFileSelection: (scope: string, name: string) => console.log("onChangeFileSelection", scope, name),
}