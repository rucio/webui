import { StoryFn, Meta } from "@storybook/react";
import { TableSortUpDown as T } from "./TableSortUpDown";
import { Column } from "@tanstack/react-table";

export default {
    title: 'Components/StreamedTables',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T> = (args) => <T {...args} />;

export const TableSortUpDown = Template.bind({});
TableSortUpDown.args = {
    name: "Name",
    column: {
        toggleSorting: () => {
            console.log("toggleSorting")
        }
    } as Column<unknown, string>,
};
