import { IFilterOptionDef, ITextFilterParams } from 'ag-grid-community';

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
