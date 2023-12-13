import { Meta, StoryFn } from "@storybook/react";
import { DIDSummaryTable } from "./DIDSummaryTable";

export default {
    title: 'Components/Rule/CreateRule/DIDSummaryTable',
    component: DIDSummaryTable,
} as Meta<typeof DIDSummaryTable>;

const template: StoryFn<typeof DIDSummaryTable> = (args) => <DIDSummaryTable {...args} />;

export const DIDSummaryTableStory = template.bind({});

DIDSummaryTableStory.args = {
    numSamples: 1,
    tabledata: [
        {
            name: "user.jdoe:file1",
            size: 100,
            requestedSize: 100,
            copies: 2,
            tags: [
                {
                    status: "success",
                    text: "Available"
                },
                {
                    status: "warning",
                    text: "Open"
                }
            ]
        },
    ]
}