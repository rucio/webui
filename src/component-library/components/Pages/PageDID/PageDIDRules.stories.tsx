import { StoryFn, Meta } from "@storybook/react";
import { PageDIDRules as P } from "./PageDIDRules";
import { RuleState } from "@/lib/core/entity/rucio";
import { createDIDRules } from "test/fixtures/table-fixtures";

export default {
    title: 'components/Pages/PageDID',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageDIDRules = Template.bind({});
PageDIDRules.args = {
    tableData: {
        data: Array.from({length: 100}, (_, i) => createDIDRules()),
        fetchStatus: "idle",
        pageSize: 10,
    }
};
