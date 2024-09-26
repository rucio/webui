import { StoryFn, Meta } from '@storybook/react';
import { fixtureRuleViewModel } from '@/test/fixtures/table-fixtures';
import { TopRulesWidget } from '@/component-library/pages/Dashboard/widgets/TopRulesWidget';

export default {
    title: 'Components/Pages/Dashboard/Widgets',
    component: TopRulesWidget,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof TopRulesWidget>;

const Template: StoryFn<typeof TopRulesWidget> = args => <TopRulesWidget {...args} />;

export const TopRules = Template.bind({});
TopRules.args = {
    rules: Array.from({ length: 100 }, fixtureRuleViewModel),
    isLoading: false,
};
