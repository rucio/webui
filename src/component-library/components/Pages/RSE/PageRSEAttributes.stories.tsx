import { StoryFn, Meta } from "@storybook/react";
import { createRSEAttribute, mockUseComDOM } from "test/fixtures/table-fixtures";
import { PageRSEAttributes as P } from "./PageRSEAttributes";

export default {
    title: 'Components/Pages/RSE',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageRSEAttributes = Template.bind({});
PageRSEAttributes.args = {
    comdom: mockUseComDOM(Array.from({ length: 20 }, (_, i) => createRSEAttribute()))
};
