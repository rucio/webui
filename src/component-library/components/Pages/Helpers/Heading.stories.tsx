import { DIDType, LockState } from "@/lib/core/entity/rucio";
import { StoryFn, Meta } from "@storybook/react";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { LockStateTag } from "../../Tags/LockStateTag";
import { Heading as H } from "./Heading";

export default {
    title: 'Components/Pages/Helpers',
    component: H,
} as Meta<typeof H>;

const Template: StoryFn<typeof H> = (args) => <H {...args} />;

export const Heading = Template.bind({});
Heading.args = {
    title: "Hello",
    subtitle: "Subtitle!!! Look at this",
    tag: <DIDTypeTag didtype={DIDType.Dataset} />,
    children: <div>World</div>
};
