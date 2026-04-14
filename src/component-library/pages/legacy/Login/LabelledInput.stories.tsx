import { StoryFn, Meta } from '@storybook/nextjs';
import { LabelledInput as L } from './LabelledInput';

export default {
    title: 'Components/Pages/Login',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = args => <L {...args} />;

export const LabelledInput = Template.bind({});
LabelledInput.args = {
    label: 'Username',
    idinput: 'username',
    updateFunc: (data: string) => console.log(data),
};
