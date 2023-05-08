import { StoryFn, Meta } from "@storybook/react";
import { PageDID as PD } from "./PageDID";

export default {
    title: "Components/Pages/PageDID",
    component: PD,
} as Meta<typeof PD>;

const Template: StoryFn<typeof PD> = (args) => <PD {...args} />;
export const PageDID = Template.bind({});
PageDID.args = {
    didMeta: {
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
    fromDidList: "yosearch" 
}