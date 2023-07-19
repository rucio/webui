import { StoryFn, Meta } from "@storybook/react";
import { CreateRuleDIDTable as C } from "./CreateRuleDIDTable";
import { DIDLong } from "@/lib/core/entity/rucio";
import { createRandomDIDLong, mockUseComDOM } from "test/fixtures/table-fixtures";

export default {
    title: 'Components/Pages/Rule',
    component: C,
} as Meta<typeof C>;

const Template: StoryFn<typeof C> = (args) => <C {...args} />;

export const CreateRuleDIDTable = Template.bind({});
CreateRuleDIDTable.args = {
    comdom: mockUseComDOM(Array.from({length: 100}, () => createRandomDIDLong())),
    handleChange: (data: DIDLong[]) => {console.info(data)},
};
