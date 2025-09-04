import type { StoryFn, Meta } from '@storybook/react';
import { CheckmarkTag as C } from './CheckmarkTag';

export default {
    title: 'Components/Tags',
    component: C,
} as Meta<typeof C>;

const Template: StoryFn<typeof C> = args => <C {...args} />;

export const CheckmarkTag = Template.bind({});
CheckmarkTag.args = {
    val: true,
};
