import { StoryFn, Meta } from '@storybook/react';

import { Alert as A } from './Alert';

export default {
    title: 'Components/Misc',
    component: A,
} as Meta<typeof Alert>;

const Template: StoryFn<typeof A> = args => <A {...args} />;

export const Alert = Template.bind({});
Alert.args = {
    message: 'Standard banner message',
    variant: 'primary',
};
