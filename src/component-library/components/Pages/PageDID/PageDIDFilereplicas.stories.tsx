import { StoryFn, Meta } from '@storybook/react';
import { PageDIDFilereplicas as PDF } from "./PageDIDFilereplicas"

export default {
    title: "Components/Pages/PageDID",
    component: PDF,
} as Meta<typeof PDF>;

const Template: StoryFn<typeof PDF> = (args) => <PDF {...args} />;

export const PageDIDFilereplicas = Template.bind({});
PageDIDFilereplicas.args = {
    data: [
        {rse: "FRESNO-AWS_SCRATCHDISK", state: "Available"},
        {rse: "PRAGUELCG2_SCRATCHDISK", state: "Unavailable"},
        {rse: "BNL-OSG2_SCRATCHDISK", state: "Copying"},
        {rse: "BNL-OSG2_SCRATCHDISK", state: "Being_Deleted"},
        {rse: "BNL-OSG2_SCRATCHDISK", state: "Bad"},
        {rse: "BNL-OSG2_SCRATCHDISK", state: "Temporary_Unavailable"},
    ],
    pageSize: 10,
    fetchStatus: "idle"
}