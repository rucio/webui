import { Table } from "@tanstack/react-table";
import { Button } from "../Button/Button";
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight } from "react-icons/hi2";
import { NumInput } from "../Input/NumInput";
import { P } from "../Text/Content/P";
import { twMerge } from "tailwind-merge";

export const PaginationDiv: React.FC<JSX.IntrinsicElements["div"] & {
    table: any;
    pageIndex: number;
    setPageIndex: (pageIndex: number) => void;
}> = (
    {
        table,
        pageIndex,
        setPageIndex,
        ...props
    }
) => {
        const { className, ...otherprops } = props
        return (
            <div className="w-full flex justify-center space-x-2 pt-2 border-t dark:border-gray-400 dark:border-t-2">
                <nav
                    className="w-[400px] flex justify-center space-x-2"
                    aria-label="Table Pagination"
                >
                    <span className="w-1/3 flex space-x-2">
                        <Button
                            onClick={() => {
                                table.setPageIndex(0)
                            }}
                            disabled={!table.getCanPreviousPage()}
                            icon={<HiChevronDoubleLeft />}
                            aria-label="First Page"
                        />
                        <Button
                            onClick={() => {
                                table.previousPage()
                            }}
                            disabled={!table.getCanPreviousPage()}
                            icon={<HiChevronLeft />}
                            aria-label="Previous Page"
                        />
                    </span>
                    <span className="w-1/3 inline-flex space-x-2 items-end">
                        <NumInput
                            value={pageIndex + 1}
                            onChange={(event) => {
                                setPageIndex(Number(event.target.value) - 1)
                            }}
                            min={1}
                            max={table.getPageCount()}
                            aria-label="Current Page Number"
                        />
                        <span
                            className="w-full dark:text-white"
                            aria-label="Total Page Count"
                        >
                            of {table.getPageCount()}
                        </span>
                    </span>
                    <span className="w-1/3 space-x-2 flex">
                        <Button
                            onClick={() => {
                                table.nextPage()
                            }}
                            disabled={!table.getCanNextPage()}
                            icon={<HiChevronRight />}
                            aria-label="Next Page"
                        />
                        <Button
                            onClick={() => {
                                table.setPageIndex(table.getPageCount() - 1)
                            }}
                            disabled={!table.getCanNextPage()}
                            icon={<HiChevronDoubleRight />}
                            aria-label="Last Page"
                        />
                    </span>
                </nav>
            </div>
        )
    }