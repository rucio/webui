import type { StoryFn, Meta } from '@storybook/react';
import { TableExternalLink as T } from './TableExternalLink';

export default {
    title: 'Components/StreamedTables',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T> = args => <T {...args} />;

export const TableExternalLink = Template.bind({});
TableExternalLink.args = {};
