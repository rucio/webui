import { DIDName, DIDSearchResponse } from '@/lib/infrastructure/data/view-model/create-rule';

import { StoryFn, Meta } from '@storybook/react';
import { ListDID as LD } from './ListDID';
import { createDIDMeta, createDID, mockUseComDOM } from 'test/fixtures/table-fixtures';

export default {
    title: 'Components/Pages/ListDID',
    component: LD,
} as Meta<typeof LD>;

const Template: StoryFn<typeof LD> = (args) => <LD {...args} />;

export const ListDID = Template.bind({});
ListDID.args = {
    comdom: mockUseComDOM(Array.from({length: 100}, () => createDID())),
    didMetaQuery: (did: DIDName) => { },
    didMetaQueryResponse: createDIDMeta()
}
