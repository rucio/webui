import { StoryFn, Meta } from '@storybook/react'
import { createRandomDIDLong } from 'test/fixtures/table-fixtures'
import { DIDSelectTable as Table } from './DIDSelectTable'

export default {
    title: 'Components/StreamedTables',
    component: Table,
} as Meta<typeof Table>

const Template: StoryFn<typeof Table> = args => <Table {...args} />

export const DIDSelectTable = Template.bind({})
DIDSelectTable.args = {
    tableData: {
        data: Array.from({length: 100}, (_, i) => createRandomDIDLong()),
        fetchStatus: "idle",
        pageSize: 10,
    },
    onChange: (selected: string[]) => { console.log(selected) },
    selected: [],
    useScopenames: false,
}

