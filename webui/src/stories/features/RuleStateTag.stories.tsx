import { RuleState } from '@/lib/core/entity/rucio';
import type { StoryFn, Meta } from '@storybook/react';
import { RuleStateTag as R } from './RuleStateTag';

export default {
    title: 'components/Tags',
    component: R,
} as Meta<typeof R>;

const Template: StoryFn<typeof R> = args => <R {...args} />;

export const RuleStateTag = Template.bind({});
RuleStateTag.args = {
    state: RuleState.OK,
    tiny: false,
};
