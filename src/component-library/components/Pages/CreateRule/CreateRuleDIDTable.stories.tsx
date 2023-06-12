import { StoryFn, Meta } from "@storybook/react";
import { CreateRuleDIDTable as C } from "./CreateRuleDIDTable";
import { DIDLong } from "@/lib/core/entity/rucio";
import { createRandomDIDLong } from "test/fixtures/table-fixtures";

export default {
    title: 'Components/Pages/CreateRule',
    component: C,
} as Meta<typeof C>;

const Template: StoryFn<typeof C> = (args) => <C {...args} />;

export const CreateRuleDIDTable = Template.bind({});
CreateRuleDIDTable.args = {
    tableData: {
        data: Array.from({ length: 100 }, (_, i) => createRandomDIDLong()),
        fetchStatus: "idle",
        pageSize: 10,
    },
    handleChange: (data: DIDLong[]) => {console.info(data)},
};
