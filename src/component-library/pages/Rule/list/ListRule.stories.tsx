import {StoryFn, Meta} from '@storybook/react';
import {fixtureRuleViewModel} from '@/test/fixtures/table-fixtures';
import {ListRule} from "@/component-library/pages/Rule/list/ListRule";
import {ToastedTemplate} from "@/component-library/templates/ToastedTemplate/ToastedTemplate";

export default {
    title: 'Components/Pages/Rule/List',
    component: ListRule,
} as Meta<typeof ListRule>;

const Template: StoryFn<typeof ListRule> = args => <ToastedTemplate>
    <ListRule {...args} />
</ToastedTemplate>;

export const InitialData = Template.bind({});
InitialData.args = {
    initialData: Array.from({length: 50}, () => fixtureRuleViewModel()),
}
