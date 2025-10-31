import { StoryFn, Meta } from '@storybook/nextjs';
import { H4 as H } from './H4';

export default {
    title: 'Components/Text/Headings',
    component: H,
} as Meta<typeof H>;

const Template: StoryFn<typeof H> = args => <H {...args} />;

export const H4 = Template.bind({});
H4.args = {
    children: 'H4',
};
