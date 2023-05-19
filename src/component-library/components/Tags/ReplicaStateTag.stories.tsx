import { ReplicaState } from "@/lib/core/entity/rucio";
import { StoryFn, Meta } from "@storybook/react";
import { ReplicaStateTag as RST } from "./ReplicaStateTag";

export default {
    title: 'Components/Tags',
    component: RST
} as Meta<typeof RST>

const Template: StoryFn<typeof RST> = args => <RST {...args}/>

export const ReplicaStateTag= Template.bind({})
ReplicaStateTag.args = {
    state: ReplicaState.Available,
    tiny: false
}