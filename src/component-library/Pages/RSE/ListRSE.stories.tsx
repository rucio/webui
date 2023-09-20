import { StoryFn, Meta } from "@storybook/react";
import { mockUseComDOM, fixtureRSEViewModel } from "test/fixtures/table-fixtures";
import { ListRSE as L } from "./ListRSE";

export default {
    title: 'Components/Pages/RSE',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = (args) => <L {...args} />;

export const ListRSE = Template.bind({});
ListRSE.args = {
    comdom: mockUseComDOM(Array.from({ length: 100 }, () => fixtureRSEViewModel())),
    setRSEQuery: (rseExpression: string) => { },
};
