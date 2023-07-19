import { CreateRuleQuery } from '@/lib/infrastructure/data/view-model/create-rule'
import { StoryFn, Meta } from '@storybook/react'
import { SummaryPage as SP } from './SummaryPage'

export default {
    title: 'Components/Pages/Rule/Components',
    component: SP,
} as Meta<typeof SP>

const Template: StoryFn<typeof SP> = args => <SP {...args} />

export const SummaryPage = Template.bind({})
SummaryPage.args = {
    data: {
        DIDList: [
            'user.AndrewJenkins:dataset-dBDUMqZWnMImKbhZCJUA',
            'user.SandraOrtiz:file-SxbkaPRbmlZezztEiAZl',
            'user.MelissaShelton:file-CaZMRUQWGhesOkWSzdkz',
            'user.JoseBarrett:file-mKHvHGlxOYhUtyAMJqdQ',
            'user.LydiaSutton:file-mKuBLQDRKBgthFnRgmJQ',
            'user.PaulCummings:file-ZUlnFYuSmcxKWooZnICx',
            'user.MeghanCalhoun:container-bdkoFMyJGgbwicrCsyeV',
            'user.LindaTanner:dataset-TpSAGnllAEIFozKSumEO',
            'user.ArielEvans:dataset-kkKMiMTqMSrOJifoUndW',
            'user.LindseyCamacho:container-cOBMVlriASiQuGguohXY',
            'user.MarcRogers:dataset-TVhCKJdrYTZVqGlowukp',
            'user.ChristopherSmith:container-RNXMmmXKHGMdCEmqtJOZ',
            'user.ShawnaBrown:container-cgLgEzDjnurZfDUTQxaz',
            'user.LaurenRichardson:container-yhTinsENWqBuYfRBYpfs',
            'user.RaymondPacheco:container-SDqOFRwIziUCRlizDaOD',
            'user.LauraWallace:dataset-FyhlLyLlqyOBPqmMwjhn',
            'user.JoelWade:dataset-dcLjidPONNGZYoHZEmUY',
            'user.TrevorGonzalez:file-PxfYHLUCVVXWsoDDJqSq',
            'user.GregoryBridges:container-qKJhmaOonuOeDLQqQqca',
            'user.AnneDrake:dataset-iSbQaNzafdlsFDiugmxv'
        ],
        RSEList: ["rse_6"],
        expirydate: new Date(),
        notifications: false,
        asynchronousMode: false,
        numcopies: 0,
        numsamples: -1,
        groupby: "File",
        comment: "",
    } as CreateRuleQuery,
}