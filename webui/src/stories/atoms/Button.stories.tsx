import { Meta, StoryFn } from '@storybook/react';

import { Button } from '@/component-library/atoms/legacy/Button/Button';

export default {
    title: 'Components/Button',
    component: Button,
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = args => <Button {...args} />;

export const Standard = Template.bind({});
Standard.args = {
    label: 'Button',
    disabled: false,
    fullwidth: false,
    type: 'button',
};
