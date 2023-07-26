import { StoryFn, Meta } from "@storybook/react";
import { DIDMetaView as DM } from "./DIDMetaView";
import { fixtureDIDMetaViewModel } from "test/fixtures/table-fixtures";

export default {
    title: "Components/Pages/DID",
    component: DM,
} as Meta<typeof DM>;

const Template: StoryFn<typeof DM> = (args) => <DM {...args} />;
export const DIDMetaView = Template.bind({});
DIDMetaView.args = {
    data: fixtureDIDMetaViewModel(),
    show: true,
}
