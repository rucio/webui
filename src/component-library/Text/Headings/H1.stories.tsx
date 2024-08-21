import { StoryFn, Meta } from '@storybook/react';

import { H1 as H1Component } from './H1';

export default {
    title: 'Components/Text/Headings',
    component: H1Component,
} as Meta<typeof H1Component>;

const Template: StoryFn<typeof H1Component> = args => <H1Component {...args} />;

export const H1 = Template.bind({});
H1.args = {
    children: 'H1',
};
