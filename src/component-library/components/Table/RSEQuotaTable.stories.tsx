import { StoryFn, Meta } from '@storybook/react'

import { RSEQuotaTable as Table } from './RSEQuotaTable'

export default {
    title: 'Components/Table',
    component: Table,
} as Meta<typeof Table>

const Template: StoryFn<typeof Table> = args => <Table {...args} />

export const RSEQuotaTable = Template.bind({})
RSEQuotaTable.args = {
    data: [
        { RSEName: "RSE1", RSEID: "RSE1", RemainingQuota: 100, TotalQuota: 1000 },
        { RSEName: "RSE2", RSEID: "RSE2", RemainingQuota: 200, TotalQuota: 2000 },
        { RSEName: "RSE3", RSEID: "RSE3", RemainingQuota: 300, TotalQuota: 3000 },
        { RSEName: "RSE4", RSEID: "RSE4", RemainingQuota: 400, TotalQuota: 4000 },
        { RSEName: "RSE5", RSEID: "RSE5", RemainingQuota: 0, TotalQuota: 5000 },
        { RSEName: "RSE6", RSEID: "RSE6", RemainingQuota: 600, TotalQuota: 6000 },
        { RSEName: "RSE7", RSEID: "RSE7", RemainingQuota: 0, TotalQuota: 7000 },
        { RSEName: "RSE8", RSEID: "RSE8", RemainingQuota: 800, TotalQuota: 8000 },
        { RSEName: "RSE9", RSEID: "RSE9", RemainingQuota: 900, TotalQuota: 9000 },
        { RSEName: "RSE10", RSEID: "RSE10", RemainingQuota: 1000, TotalQuota: 10000 },
    ],
    selected: ["RSE1"],
    onAdd: (RSEName: string) => { console.log(RSEName) },
    onRemove: (RSEName: string) => { console.log(RSEName) },
    askApproval: true,
}