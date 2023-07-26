import { StoryFn, Meta } from "@storybook/react";
import { fixtureRulePageLockEntryViewModel, fixtureRuleMetaViewModel, mockUseComDOM } from "test/fixtures/table-fixtures";
import { PageRule as P } from "./PageRule";
import { RulePageLockEntryViewModel } from "@/lib/infrastructure/data/view-model/rule";

export default {
    title: 'Components/Pages/Rule',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageRule = Template.bind({});
PageRule.args = {
    ruleMeta: fixtureRuleMetaViewModel(),
    ruleLocks: mockUseComDOM<RulePageLockEntryViewModel>(Array.from({length: 100}, () => fixtureRulePageLockEntryViewModel())),
};
