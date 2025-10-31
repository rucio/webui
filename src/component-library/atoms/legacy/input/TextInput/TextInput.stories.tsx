import { StoryFn, Meta } from '@storybook/nextjs';

import { TextInput as TI } from './TextInput';

export default {
    title: 'Components/Input',
    component: TI,
} as Meta<typeof TI>;

const Template: StoryFn<typeof TI> = args => <TI {...args} />;

export const TextInput = Template.bind({});
TextInput.args = {
    children: undefined,
    placeholder: 'Placeholder String',
};
