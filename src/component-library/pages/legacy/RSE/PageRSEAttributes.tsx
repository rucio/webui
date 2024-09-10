import { createColumnHelper } from '@tanstack/react-table';
import { TableFilterString } from '@/component-library/features/legacy/StreamedTables/TableFilterString';
import { P } from '../../../atoms/legacy/text/content/P/P';
import { H3 } from '../../../atoms/legacy/text/headings/H3/H3';
import { BoolTag } from '@/component-library/features/legacy/Tags/BoolTag';
import { NullTag } from '@/component-library/features/legacy/Tags/NullTag';
import { RSEAttribute } from '@/lib/core/entity/rucio';
import { NormalTable } from '@/component-library/features/legacy/StreamedTables/NormalTable';

export const PageRSEAttributes = (props: { attributes: RSEAttribute[] }) => {
    const columnHelper = createColumnHelper<RSEAttribute>();
    const tablecolumns: any[] = [
        columnHelper.accessor('key', {
            id: 'key',
            header: info => <TableFilterString column={info.column} name="RSE Attribute" />,
            cell: info => <P>{info.getValue()}</P>,
        }),
        columnHelper.accessor('value', {
            id: 'value',
            header: info => <H3>Value</H3>,
            cell: info => {
                const val = info.getValue();
                if (typeof val === 'boolean') {
                    return <BoolTag val={val} />;
                } else if (val === null) {
                    return <NullTag />;
                } else {
                    return <P>{val}</P>;
                }
            },
        }),
    ];
    return <NormalTable<RSEAttribute> tabledata={props.attributes} tablecolumns={tablecolumns} />;
};
