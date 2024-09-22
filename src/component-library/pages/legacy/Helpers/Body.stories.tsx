import { StoryFn, Meta } from '@storybook/react';
import { Body as B } from './Body';

export default {
    title: 'Components/Pages/Helpers',
    component: B,
} as Meta<typeof B>;

const Template: StoryFn<typeof B> = args => <B {...args} />;

export const Body = Template.bind({});
Body.args = {
    children: <p>Hello</p>,
};
