import { RuleNotification, RuleState } from "@/lib/core/entity/rucio";
import { TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { StoryFn, Meta } from "@storybook/react";
import { createRandomRulePageLockEntry, createRuleMeta } from "test/fixtures/table-fixtures";
import { PageRule as P, RulePageLockEntry } from "./PageRule";

export default {
    title: 'Components/Pages/PageRule',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageRule = Template.bind({});
PageRule.args = {
    ruleMeta: createRuleMeta(),
    ruleLocks: {
        data: Array.from({length: 100}, (_, i) => createRandomRulePageLockEntry()),
        fetchStatus: "idle",
        pageSize: 10,
    } as TableData<RulePageLockEntry>
};
