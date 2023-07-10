import { StoryFn, Meta } from "@storybook/react";
import { createRSEProtocol, mockUseComDOM } from "test/fixtures/table-fixtures";
import { PageRSEProtocols as P } from "./PageRSEProtocols";

export default {
    title: 'Components/Pages/RSE',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageRSEProtocols = Template.bind({});
PageRSEProtocols.args = {
    comdom: mockUseComDOM(Array.from({length: 20}, (_, i) => createRSEProtocol()))
};
