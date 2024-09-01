import { StoryFn, Meta } from '@storybook/react';
import { fixtureRSEAttributeViewModel } from 'test/fixtures/table-fixtures';
import { PageRSEAttributes as P } from './PageRSEAttributes';

export default {
    title: 'Components/Pages/RSE',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = args => <P {...args} />;

export const PageRSEAttributes = Template.bind({});
PageRSEAttributes.args = {
    attributes: fixtureRSEAttributeViewModel().attributes,
};
