import { Checkbox } from "@/component-library/atoms/form/checkbox"
import { CreateFilterHandlerFunc, DoesFilterPassParams, FilterDisplayParams } from "ag-grid-community"
import { useState } from "react";

/**
 * Type containing params for `AgGridMultiSelectFilter` component
 * @template T typeof the enum containing selectable values
 * @param {T[]} options list of available selection options
 * @param {function(T): string} valueFormatter if specified it is a function formatting options values for visualizing them in the floating filter
 */
type AgGridMultiSelectProps<T> = FilterDisplayParams<any, any, T[] | null> & {
    options: T[];
    valueFormatter?: (value: T) => string;
};

/**
 * Create handler for multi-select filter component.
 * @template T type of the enum containing selectable values
 * @param {T[]} options list of available selection options
 * @param {function(T): string} valueFormatter if specified it is a function formatting options values for visualizing them in the floating filter
 * @returns {{
 *      doesFilterPass: function(DoesFilterPassParams): boolean;
 *      getModelAsString: funciton(T[] | null): string;
 * }} Handler with two functions:
 *      1. `doesFilterPass` - checks whether row in table passes the filter
 *      2. `getModelAsString` - returns model as string value to show it in the floating filter
 * @example
 * ```
 * const ruleStateOptions = Object.values(RuleState);
 * const ruleStateValueFormatter = (value: RuleState) => value.toLowerCase();
 * createMultiSelectFilterHandler(ruleStateOptions, ruleStateValueFormatter);
 * ```
 */
export const createMultiSelectFilterHandler = <T,>(options: T[], valueFormatter?: (value: T) => string): CreateFilterHandlerFunc<any, any, any, T[], any> => {
    return () => ({
        doesFilterPass: ({ model, node, handlerParams }: DoesFilterPassParams<any, any, T[]>) => {
            if (!model)
                return true;

            const value = handlerParams.getValue(node);
            return model.includes(value);
        },
        getModelAsString: (model) => (
            model === null
                ? ''
                : model.length === 0
                    ? '(0)'
                    : model.length === 1
                        ? `${valueFormatter ? valueFormatter(model[0]) : String(model[0])}`
                        : model.length > 1 && model.length === options.length
                            ? 'All'
                            : `(${model.length}) ${valueFormatter ? model.map((option) => valueFormatter(option)).join(', ') : model.join(', ')}`
        )
    });
}

/**
 * Multiple-selection filter for AG Grid tables.
 * 
 * @example
 * ```
 * const [columnDefs] = useState([
        ...
        {
            headerName: 'State',
            field: 'state',
            ...
            filter: {
                component: AgGridMultiSelectFilter,
                handler: createMultiSelectFilterHandler(
                        replicaStateOptions,
                        replicaStateValueFormatter
                    ),
            },
            filterParams: {
                options: replicaStateOptions,
                valueFormatter: replicaStateValueFormatter,
            },
        },
    ]);

    ...

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} enableFilterHandlers />;
 * ```
 */
export const AgGridMultiSelectFilter = <T,>({ model, onModelChange, options, valueFormatter }: AgGridMultiSelectProps<T>) => {
    const selectedOptions = model ?? [...options];
    const [filteredOptions, setFilteredOptions] = useState([...options]);

    const applySelection = (option: T) => {
        const newSelection = selectedOptions.includes(option)
            ? selectedOptions.filter((opt) => opt !== option)
            : [...selectedOptions, option]

        if (newSelection.length === options.length)
            onModelChange(null);
        else
            onModelChange(newSelection);
    }

    const selectAllClick = () => {
        if (filteredOptions.every(option => selectedOptions.includes(option)))
            onModelChange(
                selectedOptions.filter(option => !filteredOptions.includes(option))
            )
        else if (filteredOptions.length === options.length)
            onModelChange(null);
        else {
            onModelChange(
                [
                    ...selectedOptions,
                    ...filteredOptions.filter(option => !selectedOptions.includes(option))
                ]
            );
        }
    }

    return (
        <div className="flex flex-col p-3 gap-y-2">
            <input
                type="text"
                placeholder="Search..."
                className="ag-input-field-input mb-1"
                onChange={event => setFilteredOptions(
                    options.filter(
                        option => valueFormatter
                            ? valueFormatter(option).toLowerCase().startsWith(event.target.value.toLowerCase())
                            : String(option).toLowerCase().startsWith(event.target.value.toLowerCase())
                    )
                )}
            />
            {filteredOptions.length > 0 ?
                <div className="flex items-center">
                    <Checkbox
                        id="checkbox-all"
                        className="mr-2"
                        checked={filteredOptions.every(option => selectedOptions.includes(option))}
                        onClick={selectAllClick}
                    />
                    <label className="hover:cursor-pointer" htmlFor="checkbox-all">
                        (Select all)
                    </label>
                </div>
                :
                <div className="p-3">
                    No matches.
                </div>
            }

            {filteredOptions.map(option => (
                <div key={String(option)} className="flex items-center">
                    <Checkbox
                        id={`checkbox-${String(option)}`}
                        className="mr-2"
                        checked={selectedOptions.includes(option)}
                        onClick={() => applySelection(option)}
                    />
                    <label className="hover:cursor-pointer" htmlFor={`checkbox-${String(option)}`}>
                        {valueFormatter ? valueFormatter(option) : String(option)}
                    </label>
                </div>
            ))}
        </div>
    )
}