import { RuleNotification, RuleState } from "@/lib/core/entity/rucio";
import { TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { StoryFn, Meta } from "@storybook/react";
import { createRandomRulePageLockEntry } from "test/fixtures/table-fixtures";
import { PageRule as P, RulePageLockEntry } from "./PageRule";

export default {
    title: 'Components/Pages/PageRule',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageRule = Template.bind({});
PageRule.args = {
    ruleMeta: {
        account: "root",
        activity: "Production Input",
        copies: 1,
        created_at: new Date(2022, 1, 1),
        did_type: "Dataset",
        expires_at: new Date(2024, 1, 1),
        grouping: "File",
        id: "f7ea6abe1f9841ff83dd6d6ece32d8e0",
        ignore_account_limit: false,
        ignore_availability: false,
        locked: false,
        locks_ok_cnt: 1,
        locks_replicating_cnt: 0,
        locks_stuck_cnt: 0,
        name: "user.mlassnig.pilot.test.single.hits",
        notification: RuleNotification.No,
        priority: 3,
        purge_replicas: false,
        rse_expression: "AGLT2_LOCALGROUPDISK",
        scope: "user.mlassnig",
        split_container: false,
        state: RuleState.OK,
        updated_at: new Date(2023, 1, 1),
    },
    ruleLocks: {
        data: Array.from({length: 100}, (_, i) => createRandomRulePageLockEntry()),
        fetchStatus: "idle",
        pageSize: 10,
    } as TableData<RulePageLockEntry>
};
