import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Accordion } from '@/component-library/atoms/legacy/Accordion/Accordion';

export default {
    title: 'Components/Misc',
    component: Accordion,
} as Meta<typeof Accordion>;

const Template: StoryFn<typeof Accordion> = (args) => <Accordion {...args} />;

export const Default = Template.bind({});
Default.args = {
    name: 'Sample Accordion',
    children: <p>This is the accordion content that can be expanded or collapsed.</p>
};
