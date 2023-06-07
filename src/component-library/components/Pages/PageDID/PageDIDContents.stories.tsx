import { StoryFn, Meta } from "@storybook/react";
import { createRandomDIDLong } from "test/fixtures/table-fixtures";
import { PageDIDContents as P } from "./PageDIDContents";

export default {
    title: 'Components/Pages/PageDID',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageDIDContents = Template.bind({});
PageDIDContents.args = {
    showDIDType: true,
    tableData: {
        data: Array.from({length: 100}, (_, i) => createRandomDIDLong()),
        fetchStatus: "idle",
        pageSize: 10,
    }

};
