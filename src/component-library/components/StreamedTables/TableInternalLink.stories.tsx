import { StoryFn, Meta } from "@storybook/react";
import { TableInternalLink as T } from "./TableInternalLink";

export default {
    title: 'Components/StreamedTables',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T> = (args) => <T {...args} />;

export const TableInternalLink = Template.bind({});
TableInternalLink.args = {
    children: "TableInternalLink",
};
