import { StoryFn, Meta } from "@storybook/react";
import { createSubscriptionRuleStates, mockUseComDOM } from "test/fixtures/table-fixtures";
import { ListSubscription as L } from "./ListSubscription";

export default {
    title: 'Components/Pages/Subscriptions',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = (args) => <L {...args} />;

export const ListSubscription = Template.bind({});
ListSubscription.args = {
    comdom: mockUseComDOM(Array.from({ length: 100 }, () => createSubscriptionRuleStates()))
};
