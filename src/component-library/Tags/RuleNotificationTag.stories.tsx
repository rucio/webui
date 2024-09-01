import { RuleNotification } from '@/lib/core/entity/rucio';
import { StoryFn, Meta } from '@storybook/react';
import { RuleNotificationTag as R } from './RuleNotificationTag';

export default {
    title: 'Components/Tags',
    component: R,
} as Meta<typeof R>;

const Template: StoryFn<typeof R> = args => <R {...args} />;

export const RuleNotificationTag = Template.bind({});
RuleNotificationTag.args = {
    notificationState: RuleNotification.Yes,
    tiny: false,
};
