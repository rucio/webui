
import { StoryFn, Meta } from '@storybook/react'

import { RSEQuotaTable as Table } from './RSEQuotaTable'

export default {
    title: 'Components/StreamedTables',
    component: Table,
} as Meta<typeof Table>

const Template: StoryFn<typeof Table> = args => <Table {...args} />

export const RSEQuotaTable = Template.bind({})
RSEQuotaTable.args = {
    data: [
        {
            rse_id: "rse_0",
            rse: "h9-8305684h",
            account: "Martin_Baker",
            used_files: 50,
            used_bytes: 676,
            quota_bytes: 831,
        },
        {
            rse_id: "rse_1",
            rse: "u8-7477338A",
            account: "Martin_Baker",
            used_files: 3,
            used_bytes: 403,
            quota_bytes: 1593,
        },
        {
            rse_id: "rse_2",
            rse: "p2-576767r",
            account: "Martin_Baker",
            used_files: 45,
            used_bytes: 668,
            quota_bytes: 980,
        },
        {
            rse_id: "rse_3",
            rse: "b2-1315028K",
            account: "Martin_Baker",
            used_files: 0,
            used_bytes: 901,
            quota_bytes: 1074,
        },
        {
            rse_id: "rse_4",
            rse: "r1-7904730V",
            account: "Martin_Baker",
            used_files: 22,
            used_bytes: 449,
            quota_bytes: 1197,
        },
        {
            rse_id: "rse_5",
            rse: "R9-5441721G",
            account: "Martin_Baker",
            used_files: 46,
            used_bytes: 797,
            quota_bytes: 734,
        },
        {
            rse_id: "rse_6",
            rse: "l8-231238K",
            account: "Martin_Baker",
            used_files: 19,
            used_bytes: 612,
            quota_bytes: 1989,
        },
        {
            rse_id: "rse_7",
            rse: "P7-8402193T",
            account: "Martin_Baker",
            used_files: 25,
            used_bytes: 380,
            quota_bytes: 1355,
        },
        {
            rse_id: "rse_8",
            rse: "I5-5107988g",
            account: "Martin_Baker",
            used_files: 17,
            used_bytes: 859,
            quota_bytes: 984,
        },
        {
            rse_id: "rse_9",
            rse: "I1-538502h",
            account: "Martin_Baker",
            used_files: 5,
            used_bytes: 273,
            quota_bytes: 986,
        },
    ],
    fetchstatus: "idle",
}