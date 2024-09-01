import { StoryFn, Meta } from '@storybook/react';
import { Tabs as T } from './Tabs';

export default {
    title: 'Components/Misc',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T> = args => <T {...args} />;

export const Tabs = Template.bind({});
Tabs.args = {
    tabs: ['DID', 'RSE', 'Options', 'Summary'],
    active: 1,
};
