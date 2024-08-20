import { StoryFn, Meta } from "@storybook/react";
import {fixtureRSEViewModel, mockUseChunkedStream} from "test/fixtures/table-fixtures";
import { ListRSE as L } from "./ListRSE";

export default {
    title: 'Components/Pages/RSE',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = (args) => <div className="flex flex-col h-screen"><L {...args} /></div>;

export const ListRSE = Template.bind({});
ListRSE.args = {
    streamingHook: mockUseChunkedStream(Array.from({ length: 100 }, () => fixtureRSEViewModel())),
};
