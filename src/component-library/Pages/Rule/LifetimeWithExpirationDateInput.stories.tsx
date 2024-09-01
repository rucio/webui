import { Meta, StoryFn } from '@storybook/react';
import { LifetimeWithExpirationDateInput } from './LifetimeWithExpiryDateInput';

export default {
    title: 'Components/Pages/Rule/Components',
    component: LifetimeWithExpirationDateInput,
} as Meta<typeof LifetimeWithExpirationDateInput>;

const Template: StoryFn<typeof LifetimeWithExpirationDateInput> = args => <LifetimeWithExpirationDateInput {...args} />;

export const LifeTimeWithExpirationDateInputStory = Template.bind({});

LifeTimeWithExpirationDateInputStory.args = {
    onChange: (date, lifetime) => {
        console.log(date, lifetime);
    },
    initialdate: new Date(),
    disabled: false,
    placeholder: 'Select a date',
};
