import { StoryFn, Meta } from "@storybook/react";
import { createDID } from "test/fixtures/table-fixtures";
import { PageDIDParents as P } from "./PageDIDParents";

export default {
    title: "Components/Pages/PageDID",
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageDIDParents = Template.bind({});
PageDIDParents.args = {
    tableData: {
        data: Array.from({length: 100}, (_, i) => createDID()),
        fetchStatus: "idle",
        pageSize: 10,
    }
}