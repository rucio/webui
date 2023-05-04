import { StoryFn, Meta } from "@storybook/react";
import { DIDMetaView as DM } from "./DIDMetaView";

export default {
    title: "Components/Pages/ListDID",
    component: DM,
} as Meta<typeof DM>;

const Template: StoryFn<typeof DM> = (args) => <DM {...args} />;
export const DIDMetaView = Template.bind({});
DIDMetaView.args = {
    data: {
        name: "dataset-vtPSpZYZUaCaPfBhjUOO",
        scope: "Cindy.Barr",
        account: "Cindy_Barr",
        did_type: "Dataset",
        created_at: new Date(2022, 12, 24),
        updated_at: new Date(2022, 12, 31),
        availability: "Available",
        obsolete: true,
        hidden: true,
        suppressed: true,
        purge_replicas: true,
        is_open: true,
        monotonic: false
    },
    show: true,
}
