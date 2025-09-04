import type { StoryFn, Meta } from '@storybook/react';
import { Accordion as A } from './Accordion';

export default {
    title: 'Components/Misc',
    component: A,
} as Meta<typeof A>;

const Template: StoryFn<typeof A> = args => <A {...args} />;

export const Accordion = Template.bind({});
Accordion.args = {};
