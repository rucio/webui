import { DIDName, DIDSearchResponse } from '@/lib/infrastructure/data/view-model/create-rule';

import { StoryFn, Meta } from '@storybook/react';
import { ListDID as LD } from './ListDID';
import { DID } from '@/lib/core/entity/rucio';
import { createDIDMeta, createRandomDIDLong } from 'test/fixtures/table-fixtures';

export default {
    title: 'Components/Pages/ListDID',
    component: LD,
} as Meta<typeof LD>;

const Template: StoryFn<typeof LD> = (args) => <LD {...args} />;

export const ListDID = Template.bind({});
ListDID.args = {
    didSearch: (didSearchQuery: any) => { },
    didResponse: {
        data: Array.from({length: 100}, (_, i) => createRandomDIDLong() as DID),
        fetchStatus: "idle",
    } as DIDSearchResponse,
    didMetaQuery: (did: DIDName) => { },
    didMetaQueryResponse: createDIDMeta()
}
