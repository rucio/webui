import { StoryFn, Meta } from '@storybook/nextjs';
import { RSEBlockTag as R } from './RSEBlockTag';

export default {
    title: 'Components/Tags',
    component: R,
} as Meta<typeof R>;

const Template: StoryFn<typeof R> = args => <R {...args} />;

export const RSEBlockTag = Template.bind({});
RSEBlockTag.args = {
    block: 'Delete',
};
