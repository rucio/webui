import { StoryFn, Meta } from '@storybook/react';
import { NullTag as NT } from './NullTag';

export default {
    title: 'Components/Tags',
    component: NT,
} as Meta<typeof NT>;

const Template: StoryFn<typeof NT> = args => <NT {...args} />;

export const NullTag = Template.bind({});
NullTag.args = {};
