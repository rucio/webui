import { Meta, StoryFn } from "@storybook/react";
import { ListTransferStatistics as L } from "./ListTransferStatistics";
import { fixtureTransferStatsViewModel, mockUseComDOM } from "test/fixtures/table-fixtures";

export default {
    title: 'Components/Pages/Transfers',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = (args) => <L {...args} />;

export const ListTransferStatistics = Template.bind({})
ListTransferStatistics.args = {
    comdom: mockUseComDOM(Array.from({ length: 50 }, () => fixtureTransferStatsViewModel()))
}