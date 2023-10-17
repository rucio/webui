import { Meta, StoryObj } from "@storybook/react";
import { fixtureSubscriptionRuleStatesViewModel, mockUseComDOM } from "test/fixtures/table-fixtures";
import { ListSubscription as L} from "../Pages/Subscriptions/ListSubscription";

export default {
    title: 'Demos/06_ListSubscriptions',
    component: L,
} as Meta<typeof L>;

type Story  = StoryObj<typeof L>

export const ListSubscription: Story = {
    args: {
        accountname: "test",
        comdom: mockUseComDOM(Array.from({ length: 100 }, () => fixtureSubscriptionRuleStatesViewModel()))
    }
}

