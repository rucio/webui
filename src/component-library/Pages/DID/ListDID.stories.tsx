import { StoryFn, Meta } from '@storybook/react';
import { ListDID as LD } from './ListDID';
import { fixtureDIDMetaViewModel, fixtureDIDViewModel, mockUseComDOM } from 'test/fixtures/table-fixtures';

export default {
    title: 'Components/Pages/DID',
    component: LD,
} as Meta<typeof LD>;

const Template: StoryFn<typeof LD> = args => <LD {...args} />;

export const ListDID = Template.bind({});
ListDID.args = {
    comdom: mockUseComDOM(Array.from({ length: 100 }, () => fixtureDIDViewModel())),
    didMetaQuery: (scope: string, name: string) => {},
    didMetaQueryResponse: fixtureDIDMetaViewModel(),
};
