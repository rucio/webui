import { StoryFn, Meta } from '@storybook/react';

import { DateInput as Input } from './DateInput';

export default {
    title: 'Components/Input',
    component: Input,
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = args => <Input {...args} />;

export const DateInput = Template.bind({});
DateInput.args = {
    placeholder: 'Placeholder String',
    initialdate: new Date(),
    onchange: (date: Date) => {
        console.log(date);
    },
    disabled: false,
};
