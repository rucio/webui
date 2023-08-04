import { BaseViewModel } from "@/lib/sdk/view-models";
import { StoryFn, Meta } from "@storybook/react";
import { mockBaseVM, mockUseComDOM } from "test/fixtures/table-fixtures";
import { TableErrorreader as T } from "./TableErrorreader";

export default {
    title: 'Components/StreamedTables',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T> = (args) => <T {...args} />;

export const TableErrorreader = Template.bind({});
TableErrorreader.args = {
    comdom: mockUseComDOM<BaseViewModel>(Array.from({length: 5} , () => mockBaseVM("all"))),
};
