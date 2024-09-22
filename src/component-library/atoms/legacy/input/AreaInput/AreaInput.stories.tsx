import { StoryFn, Meta } from '@storybook/react';

import { AreaInput as AI } from './AreaInput';

export default {
    title: 'Components/Input',
    component: AI,
} as Meta<typeof AI>;

const Template: StoryFn<typeof AI> = args => <AI {...args} />;

export const AreaInput = Template.bind({});
AreaInput.args = {
    content: '',
    placeholder: 'Placeholder String',
    rows: 5,
};
