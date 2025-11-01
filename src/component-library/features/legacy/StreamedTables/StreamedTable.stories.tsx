import { DIDLongViewModel } from '@/lib/infrastructure/data/view-model/did';
import { StoryFn, Meta } from '@storybook/nextjs';
import { createColumnHelper, Column } from '@tanstack/react-table';
import { fixtureDIDLongViewModel, mockUseComDOM } from '@/test/fixtures/table-fixtures';
import { StreamedTable as S } from './StreamedTable';

export default {
    title: 'Components/StreamedTables',
    component: S,
} as Meta<typeof S>;

const Template: StoryFn<typeof S> = args => <S {...args} />;

const columnHelper = createColumnHelper<DIDLongViewModel>();

export const StreamedTable = Template.bind({});
StreamedTable.args = {
    tablecomdom: mockUseComDOM<DIDLongViewModel>(Array.from({ length: 5 }, () => fixtureDIDLongViewModel())),
    tablecolumns: [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: 'did',
        }),
        columnHelper.accessor('did_type', {
            id: 'did_type',
            header: info => {
                const handleKeyDown = (e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const nextRecord = {
                            undefined: 'Dataset',
                            Dataset: 'Container',
                            Container: undefined, // default value of tanstack is undefined
                        };
                        console.log(info.column.getFilterValue());
                        const currentFilterValue = String(info.column.getFilterValue()) as keyof typeof nextRecord;
                        info.column.setFilterValue(nextRecord[currentFilterValue ?? 'null']);
                    }
                };

                return (
                    // tidbit: filter column by clicking on the header
                    <div
                        onClick={e => {
                            const nextRecord = {
                                undefined: 'Dataset',
                                Dataset: 'Container',
                                Container: undefined, // default value of tanstack is undefined
                            };
                            console.log(info.column.getFilterValue());
                            const currentFilterValue = String(info.column.getFilterValue()) as keyof typeof nextRecord;
                            info.column.setFilterValue(nextRecord[currentFilterValue ?? 'null']);
                        }}
                        onKeyDown={handleKeyDown}
                        role="button"
                        tabIndex={0}
                    >
                        <span>DID Type</span>
                    </div>
                );
            },
        }),
    ],
};
