import { StoryFn, Meta } from "@storybook/react";
import { CreateRuleDIDTable as C } from "./CreateRuleDIDTable";
import { fixtureListDIDViewModel, mockUseComDOM } from "test/fixtures/table-fixtures";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";

export default {
    title: 'Components/Pages/Rule',
    component: C,
} as Meta<typeof C>;

const Template: StoryFn<typeof C> = (args) => <C {...args} />;

export const CreateRuleDIDTable = Template.bind({});
CreateRuleDIDTable.args = {
    comdom: mockUseComDOM(Array.from({length: 100}, () => fixtureListDIDViewModel())),
    handleChange: (data: ListDIDsViewModel[]) => {console.info(data)},
};
