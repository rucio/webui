import { StoryFn, Meta } from '@storybook/nextjs';
import { BasicStatusTag as B } from './BasicStatusTag';

export default {
    title: 'Components/Tags',
    component: B,
} as Meta<typeof B>;

const Template: StoryFn<typeof B> = args => <B {...args} />;

export const BasicTag = Template.bind({});
BasicTag.args = {
    text: 'No Quota',
    status: 'error',
};
