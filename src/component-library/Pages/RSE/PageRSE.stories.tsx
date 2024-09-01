import { RSEBlockState } from '@/lib/core/entity/rucio';
import { StoryFn, Meta } from '@storybook/react';
import { fixtureRSEViewModel, fixtureRSEProtocolViewModel, fixtureRSEAttributeViewModel } from 'test/fixtures/table-fixtures';
import { PageRSE as P } from './PageRSE';

export default {
    title: 'Components/Pages/RSE',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = args => <P {...args} />;

export const PageRSE = Template.bind({});
PageRSE.args = {
    rse: fixtureRSEViewModel(),
    rseblockstate: 7 as RSEBlockState, // 7 = all blocked
    protocols: fixtureRSEProtocolViewModel(),
    attributes: fixtureRSEAttributeViewModel(),
    fromrselist: true,
};
