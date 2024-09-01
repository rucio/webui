import { StoryFn, Meta } from '@storybook/react';

import { Label as L } from './Label';

export default {
    title: 'Components/Text/Content',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = args => <L {...args} />;

export const Label = Template.bind({});
Label.args = {
    children: 'L',
};
