import { StoryFn, Meta } from '@storybook/nextjs';

import { H3 as H3Component } from './H3';

export default {
    title: 'Components/Text/Headings',
    component: H3Component,
} as Meta<typeof H3Component>;

const Template: StoryFn<typeof H3Component> = args => <H3Component {...args} />;

export const H3 = Template.bind({});
H3.args = {
    children: 'H3',
};
