import { ViewModelTableData } from '@/lib/infrastructure/hooks/useComDOM';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';

export type TableStyling = Partial<{
    visibility?: Record<string, boolean>;
    tableHeadRowStyle?: string;
    tableBodyRowStyle?: string;
    pageSize?: number;
    tableFooterStack?: boolean;
}>;

export type TableSelecting<T> = {
    handleChange: (data: T[]) => void;
    enableRowSelection: boolean;
    enableMultiRowSelection?: boolean;
    breakOut?: {
        breakoutVisibility: boolean;
        keys: Record<string, string>; // column id, displayname
    };
};

type NoDataTableProps<T> = JSX.IntrinsicElements['table'] & {
    tablecolumns: any[]; // todo type this
    tablestyling?: TableStyling;
    tableselecting?: TableSelecting<T>;
};

export type StreamedTableProps<T extends BaseViewModel> = NoDataTableProps<T> & {
    tablecomdom: UseComDOM<T>;
};

export type NormalTableProps<T> = NoDataTableProps<T> & {
    tabledata: T[];
};

// a columndef can be extended by an additional meta property
// this meta property can be used to store additional information,
// e.g. a style class for the column
export type StyleMetaColumnDef<T> = ColumnDef<T> & { meta: { style: string; filter?: boolean } };
