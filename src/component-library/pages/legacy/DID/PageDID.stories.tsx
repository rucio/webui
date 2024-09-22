import { StoryFn, Meta } from '@storybook/react';
import { PageDID as PD } from './PageDID';

import {
    fixtureDIDMetaViewModel,
    mockUseComDOM,
    fixtureDIDRulesViewModel,
    fixtureDIDViewModel,
    fixtureDIDDatasetReplicasViewModel,
    fixtureFilereplicaStateViewModel,
    fixtureFilereplicaStateDViewModel,
    fixtureDIDKeyValuePairsDataViewModel,
} from '@/test/fixtures/table-fixtures';

export default {
    title: 'Components/Pages/DID',
    component: PD,
} as Meta<typeof PD>;

const Template: StoryFn<typeof PD> = args => <PD {...args} />;
export const PageDID = Template.bind({});
PageDID.args = {
    didMeta: fixtureDIDMetaViewModel(),
    fromDidList: 'yosearch',
    // Parent DIDs [FILE]
    didParentsComDOM: mockUseComDOM(Array.from({ length: 100 }, (_, i) => fixtureDIDViewModel())),
    // DID Metadata
    didKeyValuePairsData: fixtureDIDKeyValuePairsDataViewModel(),
    // Filereplicas
    didFileReplicasComDOM: mockUseComDOM(Array.from({ length: 100 }, (_, i) => fixtureFilereplicaStateViewModel())),
    didFileReplicasDOnChange: (scope: string, name: string) => {
        console.log(scope, name, 'queried by FileReplicasDOnChange');
    },
    didRulesComDOM: mockUseComDOM(Array.from({ length: 100 }, (_, i) => fixtureDIDRulesViewModel())),
    // Contents
    didContentsComDOM: mockUseComDOM(Array.from({ length: 100 }, (_, i) => fixtureDIDViewModel())),
    didDatasetReplicasComDOM: mockUseComDOM(Array.from({ length: 100 }, (_, i) => fixtureDIDDatasetReplicasViewModel())),
};
