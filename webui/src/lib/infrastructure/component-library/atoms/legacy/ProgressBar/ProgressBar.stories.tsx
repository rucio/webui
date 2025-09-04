import type { StoryFn, Meta } from '@storybook/react';
import { ProgressBar as P } from './ProgressBar';

export default {
    title: 'Components/Misc',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = args => <P {...args} />;

export const ProgressBar = Template.bind({});
ProgressBar.args = {
    percentage: 50,
};
