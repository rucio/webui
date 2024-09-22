import { twMerge } from 'tailwind-merge';
import { createColumnHelper } from '@tanstack/react-table';

import { P } from '../../../atoms/legacy/text/content/P/P';
import { DIDTypeTag } from '@/component-library/features/legacy/Tags/DIDTypeTag';
import { DIDType } from '@/lib/core/entity/rucio';
import { StreamedTable } from '@/component-library/features/legacy/StreamedTables/StreamedTable';
import { TableFilterString } from '@/component-library/features/legacy/StreamedTables/TableFilterString';
import { TableFilterDiscrete } from '@/component-library/features/legacy/StreamedTables/TableFilterDiscrete';
import { HiDotsHorizontal } from 'react-icons/hi';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { TableInternalLink } from '@/component-library/features/legacy/StreamedTables/TableInternalLink';

export const PageDIDByType = (props: { comdom: UseComDOM<DIDViewModel>; showDIDType?: boolean }) => {
    const columnHelper = createColumnHelper<DIDViewModel>();
    const tablecolumns: any[] = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: 'did',
            header: info => {
                return <TableFilterString column={info.column} name="DID" />;
            },
            cell: info => {
                return (
                    <TableInternalLink href={`/did/page/${info.row.original.scope}/${info.row.original.name}`}>{info.getValue()}</TableInternalLink>
                );
            },
        }),
        columnHelper.accessor('did_type', {
            id: 'did_type',
            header: info => {
                return (
                    <TableFilterDiscrete<DIDType>
                        name="DID Type"
                        keys={[DIDType.CONTAINER, DIDType.DATASET, DIDType.FILE]}
                        renderFunc={state =>
                            state === undefined ? (
                                <HiDotsHorizontal className="text-2xl text-text-500 dark:text-text-200" />
                            ) : (
                                <DIDTypeTag didtype={state} forcesmall />
                            )
                        }
                        column={info.column}
                    />
                );
            },
            cell: info => <DIDTypeTag didtype={info.getValue()} />,
            meta: {
                style: 'w-6 sm:w-8 md:w-36',
            },
        }),
    ];

    return <StreamedTable<DIDViewModel> tablecomdom={props.comdom} tablecolumns={tablecolumns} tablestyling={{}} />;
};
