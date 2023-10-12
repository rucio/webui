import { Meta, StoryFn } from "@storybook/react";
import { TransferStatistics as T } from "./TransferStatistics";
import { fixtureRequestStatsPerPair } from "test/fixtures/table-fixtures";

export default {
    title: 'Components/Pages/Transfers',
    component: T,
} as Meta<typeof T>

const Template: StoryFn<typeof T> = (args) => <T {...args} />;

export const TransferStatistics = Template.bind({})
TransferStatistics.args = {
    request_stats: fixtureRequestStatsPerPair()
}