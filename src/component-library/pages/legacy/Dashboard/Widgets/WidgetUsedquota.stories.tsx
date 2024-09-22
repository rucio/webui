import { StoryFn, Meta } from '@storybook/react';
import { WidgetUsedquota as W } from './WidgetUsedquota';
import { fixtureUsedquota } from '@/test/fixtures/widget-fixtures';

export default {
    title: 'Components/Pages/Dashboard/Widgets',
    component: W,
} as Meta<typeof W>;

const Template: StoryFn<typeof W> = args => <W {...args} />;

export const WidgetUsedquota = Template.bind({});
WidgetUsedquota.args = {
    input: Array.from({ length: 20 }, (v, k) => fixtureUsedquota()),
};
