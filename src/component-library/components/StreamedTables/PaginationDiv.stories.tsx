import { StoryFn, Meta } from "@storybook/react";
import { PaginationDiv as PD } from "./PaginationDiv";

export default {
    title: "Components/StreamedTables",
    component: PD,
} as Meta<typeof PD>

const Template: StoryFn<typeof PD> = (args) => <PD {...args} />

export const PaginationDiv = Template.bind({})
PaginationDiv.args = {
    pageIndex: 0,
    setPageIndex: () => {},
    table: {
        setPageIndex: () => {},
        getCanPreviousPage: () => true,
        previousPage: () => {},
        getPageCount: () => 1,
        nextPage: () => {},
        getCanNextPage: () => true,
    }
}