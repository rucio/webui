import { StoryFn, Meta } from '@storybook/nextjs';
import { fixtureRSEAccountUsageViewModel } from '@/test/fixtures/table-fixtures';
import { TopStorageUsageWidget } from '@/component-library/pages/Dashboard/widgets/TopStorageUsageWidget';

export default {
    title: 'Components/Pages/Dashboard/Widgets',
    component: TopStorageUsageWidget,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof TopStorageUsageWidget>;

const Template: StoryFn<typeof TopStorageUsageWidget> = args => <TopStorageUsageWidget {...args} />;

export const TopStorageUsage = Template.bind({});
TopStorageUsage.args = {
    usages: Array.from({ length: 10 }, fixtureRSEAccountUsageViewModel),
    isLoading: false,
};
