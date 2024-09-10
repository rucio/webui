import { StoryFn, Meta } from '@storybook/react';
import { SubscriptionStateTag as S } from './SubscriptionStateTag';

export default {
    title: 'Components/Tags',
    component: S,
} as Meta<typeof S>;

const Template: StoryFn<typeof S> = args => <S {...args} />;

export const SubscriptionStateTag = Template.bind({});
SubscriptionStateTag.args = {};
