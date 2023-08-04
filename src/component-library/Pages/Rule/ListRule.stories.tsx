import { StoryFn, Meta } from "@storybook/react";
import { ListRule as L } from "./ListRule";
import { mockUseComDOM, fixtureRuleViewModel } from "test/fixtures/table-fixtures";

export default {
    title: 'Components/Pages/Rule',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = (args) => <L {...args} />;

export const ListRule = Template.bind({});
ListRule.args = {
    comdom: mockUseComDOM(Array.from({length: 100}, () => fixtureRuleViewModel()))
};
