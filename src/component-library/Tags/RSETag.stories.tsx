import { StoryFn, Meta } from '@storybook/react';
import { RSETag as R } from './RSETag';

export default {
    title: 'Components/Tags',
    component: R,
} as Meta<typeof R>;

const Template: StoryFn<typeof R> = args => <R {...args} />;

export const RSETag = Template.bind({});
RSETag.args = {
    blocked: 0,
};
