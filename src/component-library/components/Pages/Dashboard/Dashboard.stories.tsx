import { StoryFn, Meta } from "@storybook/react";
import { Dashboard as D } from "./Dashboard";

export default {
    title: 'Components/Pages/Dashboard',
    component: D,
} as Meta<typeof D>;

const Template: StoryFn<typeof D> = (args) => <D {...args} />;

export const Dashboard = Template.bind({});
Dashboard.args = {
    accountname: "test",
    linkrecord: {
        "List DIDs": "/list/dids",
        "List RSEs": "/list/rses",
        "List Rules":"/list/rules",
        "List Subscriptions": "/list/subscriptions",
        "Create Rule": "/create/rule",
    }
};
