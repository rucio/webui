import { RSEBlockState } from "@/lib/core/entity/rucio";
import { StoryFn, Meta } from "@storybook/react";
import { createRSE, createRSEProtocol, createRSEAttribute, mockUseComDOM } from "test/fixtures/table-fixtures";
import { PageRSE as P } from "./PageRSE";

export default {
    title: 'Components/Pages/RSE',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageRSE = Template.bind({});
PageRSE.args = {
    rse: createRSE(),
    rseblockstate: 7 as RSEBlockState, // 7 = all blocked
    protocolscomdom: mockUseComDOM(Array.from({length: 20}, (_, i) => createRSEProtocol())),
    attributescomdom: mockUseComDOM(Array.from({ length: 20 }, (_, i) => createRSEAttribute())),
    fromrselist: true,
};
