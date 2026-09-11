import { Checkbox } from "@/component-library/atoms/form/checkbox"
import { CreateFilterHandlerFunc, DoesFilterPassParams, FilterDisplayParams, FilterHandler } from "ag-grid-community"
import { useState } from "react";

type AgMultiSelectProps<T> = FilterDisplayParams<any, any, T[] | null> & { options: T[], valueFormatter?: (value: T) => string }

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

export const AgMultiSelectFilter = <T,>({ model, onModelChange, options, valueFormatter }: AgMultiSelectProps<T>) => {
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
                className="ag-input-filed-input mb-2"
                onChange={event => setFilteredOptions(
                    options.filter(
                        option => valueFormatter
                            ? valueFormatter(option).toLowerCase().startsWith(event.target.value.toLowerCase())
                            : String(option).toLowerCase().startsWith(event.target.value.toLowerCase())
                    )
                )}
            />
            {filteredOptions.length > 0 ?
                <label className="flex items-center">
                    <Checkbox
                        className="mr-2"
                        checked={filteredOptions.every(option => selectedOptions.includes(option))}
                        onClick={selectAllClick}
                    />
                    (Select all)
                </label>
                :
                <div className="p-3">
                    No matches.
                </div>
            }
            
            {filteredOptions.map(option => (
                <label key={String(option)} className="flex items-center">
                    <Checkbox
                        className="mr-2"
                        checked={selectedOptions.includes(option)}
                        onClick={() => applySelection(option)}
                    />
                    {valueFormatter ? valueFormatter(option) : String(option)}
                </label>
            ))}
        </div>
    )
}