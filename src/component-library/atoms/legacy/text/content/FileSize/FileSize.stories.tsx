import { StoryFn, Meta } from '@storybook/nextjs';

import { FileSize as L } from './FileSize';

export default {
    title: 'Components/Text/Content',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = args => <L {...args} />;

export const Number = Template.bind({});
Number.args = {
    bytesNumber: 2000,
    decimalPlaces: 2,
};
