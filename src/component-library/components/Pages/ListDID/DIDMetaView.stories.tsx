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
        "name": "dataset-YSytZjXJMdiCsSiiUwXx",
        "scope": "Lawrence.Myers",
        "account": "Lawrence_Myers",
        "did_type": "Dataset",
        "created_at": new Date(2021, 3),
        "updated_at": new Date(2022, 10),
        "availability": "Deleted",
        "obsolete": false,
        "hidden": true,
        "suppressed": true,
        "purge_replicas": true,
        "monotonic": true,
        "is_open": true,
        "adler32": null,
        "guid": null,
        "md5": null,
        "filesize": null
    },
    show: true,
}
