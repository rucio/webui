import { StoryFn, Meta } from "@storybook/react";
import { ListDIDTable as L } from "./ListDIDTable";
import { createDID, mockUseComDOM } from "test/fixtures/table-fixtures";
import { DID } from "@/lib/core/entity/rucio";

export default {
    title: 'Components/Pages/DID',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = (args) => <L {...args} />;

export const ListDIDTable = Template.bind({});
ListDIDTable.args = {
    comdom: mockUseComDOM(Array.from({length: 100}, () => createDID())),
    selectionFunc: (data: DID[]) => {console.info("ListDIDTable", data)}
};
