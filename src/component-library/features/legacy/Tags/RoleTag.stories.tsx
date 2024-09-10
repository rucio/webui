import { Role } from '@/lib/core/entity/account';
import { StoryFn, Meta } from '@storybook/react';
import { RoleTag as R } from './RoleTag';

export default {
    title: 'Components/Tags',
    component: R,
} as Meta<typeof R>;

const Template: StoryFn<typeof R> = args => <R {...args} />;

export const RoleTag = Template.bind({});
RoleTag.args = {
    role: Role.ADMIN,
};
