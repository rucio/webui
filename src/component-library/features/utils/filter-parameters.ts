import { ITextFilterParams, IFilterOptionDef } from 'ag-grid-community';

export const DefaultBooleanFilterParams: ITextFilterParams = {
    filterOptions: [
        'empty',
        {
            numberOfInputs: 0,
            displayKey: 'true',
            displayName: 'True',
            predicate: (_: any[], cellValue: any) => cellValue,
        },
        {
            numberOfInputs: 0,
            displayKey: 'false',
            displayName: 'False',
            predicate: (_: any[], cellValue: any) => !cellValue,
        },
    ],
    buttons: ['reset'],
};

export const DefaultTextFilterParams: ITextFilterParams = {
    filterOptions: ['contains'],
    buttons: ['reset'],
    maxNumConditions: 1,
};

export const buildDiscreteFilterParams = (values: string[]): ITextFilterParams => {
    return {
        filterOptions: [
            'empty',
            ...values.map(value => {
                return {
                    numberOfInputs: 0,
                    displayKey: value.toLowerCase(),
                    displayName: value,
                    predicate: (_: any[], cellValue: any) => cellValue === value,
                } as IFilterOptionDef;
            }),
        ],
        maxNumConditions: 1,
        buttons: ['reset'],
    };
};
