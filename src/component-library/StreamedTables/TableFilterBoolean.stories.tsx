import { StoryFn, Meta } from "@storybook/react";
import { Column } from "@tanstack/react-table";
import { TableFilterBoolean as T } from "./TableFilterBoolean";

export default {
    title: 'Components/StreamedTables',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T> = (args) => <T {...args} />;

export const TableFilterBoolean = Template.bind({});
TableFilterBoolean.args = {
    name: "Label",
    column: {
        setFilterValue: (filter: boolean | undefined) => {
            console.log(filter)
        }
    } as Column<unknown, boolean>,
};
