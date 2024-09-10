import { ITextFilterParams } from 'ag-grid-community';

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
