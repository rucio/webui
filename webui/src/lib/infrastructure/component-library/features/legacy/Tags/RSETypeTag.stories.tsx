import type { StoryFn, Meta } from '@storybook/react';
import { RSETypeTag as R } from './RSETypeTag';

export default {
    title: 'Components/Tags',
    component: R,
} as Meta<typeof R>;

const Template: StoryFn<typeof R> = args => <R {...args} />;

export const RSETypeTag = Template.bind({});
RSETypeTag.args = {};
