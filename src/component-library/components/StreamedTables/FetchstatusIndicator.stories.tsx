import { StoryFn, Meta } from "@storybook/react";
import { FetchstatusIndicator as FI } from "./FetchstatusIndicator";

export default {
    title: "Components/StreamedTables",
    component: FI,
} as Meta<typeof FI>

const Template: StoryFn<typeof FI> = (args) => <FI {...args} />

export const FetchstatusIndicator = Template.bind({})
FetchstatusIndicator.args = {
    status: "fetching",
}