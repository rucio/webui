import React from 'react';
import { Table } from '@tanstack/react-table';
import { Button } from '../../../atoms/legacy/Button/Button';
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight } from 'react-icons/hi';
import { NumInput } from '../../../atoms/legacy/input/NumInput/NumInput';
import { twMerge } from 'tailwind-merge';

export const TablePaginationNav: React.FC<
    React.ComponentPropsWithoutRef<'div'> & {
        table: Table<any>;
    }
> = ({ table, ...props }) => {
    const { className, ...otherprops } = props;
    return (
        <nav className={twMerge('w-full flex justify-center space-x-1 sm:space-x-2 h-8')} aria-label="Table Pagination" {...otherprops}>
            <span className="w-1/3 flex space-x-1">
                <Button
                    onClick={() => {
                        table.setPageIndex(0);
                    }}
                    disabled={!table.getCanPreviousPage()}
                    icon={<HiChevronDoubleLeft />}
                    aria-label="First Page"
                />
                <Button
                    onClick={() => {
                        table.previousPage();
                    }}
                    disabled={!table.getCanPreviousPage()}
                    icon={<HiChevronLeft />}
                    aria-label="Previous Page"
                />
            </span>
            <span className="w-1/3 inline-flex space-x-1 md:space-x-2 items-end">
                <NumInput
                    value={table.getState().pagination.pageIndex + 1}
                    onChange={event => {
                        table.setPageIndex(Number(event.target.value) - 1);
                    }}
                    min={1}
                    max={table.getPageCount()}
                    aria-label="Current Page Number"
                />
                <span className="w-full dark:text-text-0 text-text-1000" aria-label="Total Page Count">
                    of {table.getPageCount()}
                </span>
            </span>
            <span className="w-1/3 space-x-1 flex">
                <Button
                    onClick={() => {
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                    icon={<HiChevronRight />}
                    aria-label="Next Page"
                />
                <Button
                    onClick={() => {
                        table.setPageIndex(table.getPageCount() - 1);
                    }}
                    disabled={!table.getCanNextPage()}
                    icon={<HiChevronDoubleRight />}
                    aria-label="Last Page"
                />
            </span>
        </nav>
    );
};
