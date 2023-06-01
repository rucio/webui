import { Column, Table } from "@tanstack/react-table";
import { TextInput } from "../Input/TextInput";

export const Filter = (
    props: {
        column: Column<any, any>,
        table: Table<any>
        placeholder?: string
    }
) => {
    const { column, table } = props;
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    return typeof firstValue === "number" ? (
        <div className="flex space-x-2">
            <input
                type="number"
                value={(columnFilterValue as [number, number])?.[0] ?? ""}
                onChange={(e) =>
                    column.setFilterValue((old: [number, number]) => [
                        e.target.value,
                        old?.[1],
                    ])
                }
                placeholder={`Min`}
                className="w-24 border shadow rounded"
            />
            <input
                type="number"
                value={(columnFilterValue as [number, number])?.[1] ?? ""}
                onChange={(e) =>
                    column.setFilterValue((old: [number, number]) => [
                        old?.[0],
                        e.target.value,
                    ])
                }
                placeholder={`Max`}
            />
        </div>
    ) : (
        <span className="w-full pr-4">
            <TextInput
                placeholder={props.placeholder ?? "Filter Results"}
                onChange={(e) => column.setFilterValue(e.target.value)}
            />
        </span>

    );
}