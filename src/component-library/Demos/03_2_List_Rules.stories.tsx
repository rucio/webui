import { Meta, StoryObj } from "@storybook/react";
import { fixtureRuleViewModel, mockUseComDOM } from "test/fixtures/table-fixtures";
import { ListRule  as CR} from "../Pages/Rule/ListRule";

export default {
    title: 'Demos/04_ListRules',
    component: CR,
} as Meta<typeof CR>;

type Story  = StoryObj<typeof CR>

export const CreateRule: Story = {
    args: {
        comdom: mockUseComDOM(Array.from({length: 100}, () => fixtureRuleViewModel()))
    }
}

