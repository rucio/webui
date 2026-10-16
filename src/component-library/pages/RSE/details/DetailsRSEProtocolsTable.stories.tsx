import type { Meta, StoryObj } from '@storybook/nextjs';
import { DetailsRSEProtocolsTable } from './DetailsRSEProtocolsTable';
import { fixtureRSEDetailsProtocol } from '@/test/fixtures/table-fixtures';
import { RSEDetailsProtocol } from '@/lib/core/entity/rucio';

const meta = {
    title: 'Components/Pages/RSE/Details/ProtocolsTable',
    component: DetailsRSEProtocolsTable,
    parameters: {
        docs: { disable: true },
    },
    // Mirrors the fixed-height container the table sits in on the RSE details page
    decorators: [
        Story => (
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DetailsRSEProtocolsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const withPrefix = (prefix: string): RSEDetailsProtocol => ({ ...fixtureRSEDetailsProtocol(), prefix });

export const Default: Story = {
    args: {
        rowData: Array.from({ length: 12 }, fixtureRSEDetailsProtocol),
    },
};

/**
 * The prefixes seen on deployed RSEs are deep storage paths. They should be readable
 * without resizing the column or hovering over the cell.
 */
export const LongPrefixes: Story = {
    args: {
        rowData: [
            withPrefix('/pnfs/fnal.gov/usr/cms/WAX/11/store/'),
            withPrefix('/dpm/in2p3.fr/home/cms/phedex/store/mc/RunIISummer20UL18/'),
            withPrefix('/eos/atlas/atlasdatadisk/rucio/'),
            withPrefix('/pnfs/rucio/disk-only/scratchdisk/'),
            withPrefix('/rucio/tmpdisk/rucio_tests/'),
            withPrefix('/tmp/rucio_rse/'),
        ],
    },
};
