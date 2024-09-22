import { StoryFn, Meta } from '@storybook/react';
import { NotFound as N } from './NotFound';

export default {
    title: 'Components/Pages/Helpers',
    component: N,
} as Meta<typeof N>;

const Template: StoryFn<typeof N> = args => <N {...args} />;

export const NotFound = Template.bind({});
NotFound.args = {};
