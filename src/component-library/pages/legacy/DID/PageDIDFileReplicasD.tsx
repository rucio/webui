// components
import { P } from '../../../atoms/legacy/text/content/P/P';
import { PageDIDFilereplicas } from './PageDIDFileReplicas';

// misc packages, react
import { createColumnHelper } from '@tanstack/react-table';
import { twMerge } from 'tailwind-merge';

// Viewmodels etc
import { StreamedTable } from '@/component-library/features/legacy/StreamedTables/StreamedTable';
import { TableFilterString } from '@/component-library/features/legacy/StreamedTables/TableFilterString';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { DIDViewModel, FileReplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';
import { TableInternalLink } from '@/component-library/features/legacy/StreamedTables/TableInternalLink';

export const PageDIDFilereplicasD = (props: {
    datasetComDOM: UseComDOM<DIDViewModel>; // the files in the dataset
    replicaComDOM: UseComDOM<FileReplicaStateViewModel>; // replicas of the selected file
    onChangeFileSelection: (scope: string, name: string) => void;
}) => {
    const { datasetComDOM, replicaComDOM, onChangeFileSelection } = props;
    const columnHelper = createColumnHelper<DIDViewModel>();
    const tablecolumns: any[] = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: 'did',
            header: info => {
                return <TableFilterString column={info.column} name="File" />;
            },
            cell: info => {
                return (
                    <TableInternalLink href={`/did/page/${info.row.original.scope}/${info.row.original.name}`}>{info.getValue()}</TableInternalLink>
                );
            },
        }),
    ];

    return (
        <div className="pt-1">
            <i>Select a file and view the states of its replicas.</i>
            <div className={twMerge('xl:grid xl:grid-cols-2 xl:gap-4 xl:pt-1')}>
                <StreamedTable<DIDViewModel>
                    tablecomdom={datasetComDOM}
                    tablecolumns={tablecolumns}
                    tablestyling={{
                        tableFooterStack: true,
                    }}
                    tableselecting={{
                        handleChange: (data: DIDViewModel[]) => {
                            if (data.length === 0) return;
                            onChangeFileSelection(data[0].scope, data[0].name);
                        },
                        enableRowSelection: true,
                        enableMultiRowSelection: false,
                    }}
                />
                <PageDIDFilereplicas
                    comdom={replicaComDOM}
                    tablestyling={{
                        tableFooterStack: true,
                    }}
                />
            </div>
        </div>
    );
};
