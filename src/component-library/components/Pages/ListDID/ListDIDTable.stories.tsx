import { StoryFn, Meta } from "@storybook/react";
import { ListDIDTable as L } from "./ListDIDTable";
import { createRandomDIDLong } from "test/fixtures/table-fixtures";
import { DID } from "@/lib/core/entity/rucio";

export default {
    title: 'Components/Pages/ListDID',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = (args) => <L {...args} />;

export const ListDIDTable = Template.bind({});
ListDIDTable.args = {
    tableData: {
        data: Array.from({length: 100}, (_, i) => createRandomDIDLong() as DID),
        fetchStatus: "idle",
        pageSize: 10,
    }
};
