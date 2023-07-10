import { RuleNotification, RuleState } from "@/lib/core/entity/rucio";
import { TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { StoryFn, Meta } from "@storybook/react";
import { createRandomRulePageLockEntry, createRuleMeta, mockUseComDOM } from "test/fixtures/table-fixtures";
import { PageRule as P, RulePageLockEntry } from "./PageRule";

export default {
    title: 'Components/Pages/PageRule',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageRule = Template.bind({});
PageRule.args = {
    ruleMeta: createRuleMeta(),
    ruleLocks: mockUseComDOM<RulePageLockEntry>(Array.from({length: 100}, () => createRandomRulePageLockEntry())),
};
