import { twMerge } from 'tailwind-merge';
import { TablePaginationNav } from './TablePaginationNav';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { NormalTableProps } from './types';
import { usePrepareTable } from './helpers';

export function NormalTable<T>(props: NormalTableProps<T>) {
    const { className, ...otherprops } = props;

    const { table, ...othertables } = usePrepareTable<T>({
        tabledata: props.tabledata,
        tablecolumns: props.tablecolumns,
        tablestyling: props.tablestyling,
    });

    return (
        <table
            className={twMerge('bg-neutral-0 dark:bg-neutral-700 dark:text-neutral-0 text-neutral-1000', 'w-full', 'relative', 'table-fixed', className)}
            {...otherprops}
            role="grid" // if table maintains selection state or allows 2D nav -> use grid
            // see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/table_role#description
        >
            <TableHeader table={table} tablestyling={props.tablestyling} />
            <TableBody table={table} tablestyling={props.tablestyling} />
            <tfoot className={twMerge('h-8')} role="rowgroup" aria-label="NormalTable Footer">
                <tr aria-label="Pagination Controls">
                    <td colSpan={table.getVisibleLeafColumns().length}>
                        <div className="flex flex-col items-center">
                            <div className="w-full md:w-[400px]">
                                <TablePaginationNav table={table} />
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}
