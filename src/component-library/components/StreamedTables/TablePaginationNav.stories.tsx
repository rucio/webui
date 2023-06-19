import { StoryFn, Meta } from "@storybook/react";
import { TableState, Table } from "@tanstack/react-table";
import { TablePaginationNav as PD } from "./TablePaginationNav";

export default {
    title: "Components/StreamedTables",
    component: PD,
} as Meta<typeof PD>

const Template: StoryFn<typeof PD> = (args) => <PD {...args} />

export const PaginationNav = Template.bind({})
PaginationNav.args = {
    table: {
        setPageIndex: (num: number) => {},
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
            } as TableState
        }
    } as Table<any>
}