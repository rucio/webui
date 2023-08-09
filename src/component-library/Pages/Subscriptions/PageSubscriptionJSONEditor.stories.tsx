import { StoryFn, Meta } from "@storybook/react";
import { fixtureSubscriptionViewModel } from "test/fixtures/table-fixtures";
import { PageSubscriptionJSONEditor as P } from "./PageSubscriptionJSONEditor";

import { Type } from "@sinclair/typebox";

export default {
    title: 'Components/Pages/Subscriptions',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

const FilterSchema = Type.Object({
    scope: Type.Array(Type.String()),
    project: Type.Array(Type.String()),
    split_rule: Type.Optional(Type.Boolean()),
})

export const PageSubscriptionJSONEditor = Template.bind({});
PageSubscriptionJSONEditor.args = {
    defaultString: fixtureSubscriptionViewModel().filter,
    submit: (json: string) => { console.log(json) },
    schema: FilterSchema
};
