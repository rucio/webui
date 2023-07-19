import { RSEAccountUsageLimit } from "@/lib/core/entity/rucio";
import { StoryFn, Meta } from "@storybook/react";
import { createRSEAccountUsageLimit, mockUseComDOM } from "test/fixtures/table-fixtures";
import { CreateRuleRSETable as C } from "./CreateRuleRSETable";

export default {
    title: 'Components/Pages/Rule',
    component: C,
} as Meta<typeof C>;

const Template: StoryFn<typeof C> = (args) => <C {...args} />;

export const CreateRuleRSETable = Template.bind({});
CreateRuleRSETable.args = {
    comdom: mockUseComDOM(Array.from({length: 100}, () => createRSEAccountUsageLimit())),
    handleChange: (data: RSEAccountUsageLimit[]) => {console.info(data)},
};
