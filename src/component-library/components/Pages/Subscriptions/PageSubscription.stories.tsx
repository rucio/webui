import { StoryFn, Meta } from "@storybook/react";
import { createSubscriptionMeta } from "test/fixtures/table-fixtures";
import { PageSubscription as P } from "./PageSubscription";

export default {
    title: 'Components/Pages/Subscriptions',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageSubscription = Template.bind({});
PageSubscription.args = {
    subscriptionViewModel: createSubscriptionMeta()
};
