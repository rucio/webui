import { StoryFn, Meta } from "@storybook/react";
import { FullFilter as F } from "./FullFilter";

export default {
    title: 'Components/StreamedTables',
    component: F,
} as Meta<typeof F>;

const Template: StoryFn<typeof F> = (args) => <F {...args} />;

export const FullFilter = Template.bind({});
FullFilter.args = {
    columnTitle: "Column Title",
    placeholder: "Placeholder",
    column: {},
    table: {
        getColumn: (id: string) => {
            return {
                id: "id",
                setFilterValue: (value: any) => { },
                getFilterValue: () => { }
            }
        },
        getPreFilteredRowModel: () => {
            return {
                flatRows: [
                    {
                        getValue: (id: string) => { }
                    }
                ]
            }
        }
    }
};
