import { StoryFn, Meta } from "@storybook/react";
import { PaginationDiv as PD } from "./PaginationDiv";

export default {
    title: "Components/StreamedTables",
    component: PD,
} as Meta<typeof PD>

const Template: StoryFn<typeof PD> = (args) => <PD {...args} />

export const PaginationDiv = Template.bind({})
PaginationDiv.args = {
    table: {
        setPageIndex: () => {},
        getCanPreviousPage: () => false,
        previousPage: () => {},
        getPageCount: () => 1,
        nextPage: () => {},
        getCanNextPage: () => true,
        getState: () => {
            return {
                pagination: {
                    pageIndex: 0
                }
            }
        }
    }
}