import { StoryFn, Meta } from "@storybook/react";
import { mockUseComDOM } from "test/fixtures/table-fixtures";
import { TableFetchstatus as T } from "./TableFetchstatus";

export default {
    title: 'Components/StreamedTables',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T> = (args) => <T {...args} />;

export const TablePauseStop = Template.bind({});
TablePauseStop.args = {
    comdom: mockUseComDOM([])
};
