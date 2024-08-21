import { StoryFn, Meta } from '@storybook/react';
import { fixtureDIDKeyValuePairsDataViewModel, mockUseComDOM } from 'test/fixtures/table-fixtures';
import { PageDIDMetadata as P } from './PageDIDMetadata';

export default {
    title: 'Components/Pages/DID',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = args => <P {...args} />;

export const PageDIDMetadata = Template.bind({});
PageDIDMetadata.args = {
    tabledata: fixtureDIDKeyValuePairsDataViewModel(),
};
