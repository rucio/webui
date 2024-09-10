import { StoryFn, Meta } from '@storybook/react';
import { Column, Row, Table, TableState } from '@tanstack/react-table';
import { FetchStatus } from '@tanstack/react-query';
import { TableFooter as T } from './TableFooter';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { mockUseComDOM } from '@/test/fixtures/table-fixtures';

export default {
    title: 'Components/StreamedTables',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T> = args => <T {...args} />;

export const TableFooter = Template.bind({});
TableFooter.args = {
    table: {
        getVisibleLeafColumns: () => [{} as Column<any, any>],
        getSelectedRowModel: () => {
            return {
                flatRows: [{} as Row<any>],
            };
        },
        setPageIndex: (num: number) => {},
        getCanPreviousPage: () => false,
        previousPage: () => {},
        getPageCount: () => 1,
        nextPage: () => {},
        getCanNextPage: () => false,
        getState: () => {
            return {
                pagination: {
                    pageIndex: 0,
                },
            } as TableState;
        },
    } as Table<any>,
    comdom: mockUseComDOM([]),
    breakout: {
        breakoutVisibility: true,
        keys: {},
    },
};
