import { Meta, StoryFn } from "@storybook/react";
import { ListTransfer as L } from "./ListTransfer";
import { fixtureTransferViewModel, mockUseComDOM } from "test/fixtures/table-fixtures";

export default {
    title: 'Components/Pages/Transfers',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = (args) => <L {...args} />;

export const ListTransfer = Template.bind({})
ListTransfer.args = {
    comdom: mockUseComDOM(Array.from({ length: 50 }, () => fixtureTransferViewModel()))
};
