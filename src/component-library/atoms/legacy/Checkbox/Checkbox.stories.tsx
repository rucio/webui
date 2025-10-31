import { StoryFn, Meta } from '@storybook/nextjs';
import { Checkbox as C } from './Checkbox';

export default {
    title: 'Components/Button',
    component: C,
} as Meta<typeof C>;

const Template: StoryFn<typeof C> = args => <C {...args} />;

export const Checkbox = Template.bind({});
Checkbox.args = {};
