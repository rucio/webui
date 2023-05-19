import { StoryFn, Meta } from '@storybook/react';
import { PageDIDFilereplicas as PDF } from "./PageDIDFilereplicas"
import { ReplicaState } from '@/lib/core/entity/rucio';

export default {
    title: "Components/Pages/PageDID",
    component: PDF,
} as Meta<typeof PDF>;

const Template: StoryFn<typeof PDF> = (args) => <PDF {...args} />;

export const PageDIDFilereplicas = Template.bind({});
PageDIDFilereplicas.args = {
    tableData: {
        data: [
            { rse: "FRESNO-AWS_SCRATCHDISK", state: ReplicaState.Available },
            { rse: "PRAGUELCG2_SCRATCHDISK", state: ReplicaState.Unavailable },
            { rse: "BNL-OSG2_SCRATCHDISK", state: ReplicaState.Copying },
            { rse: "BNL-OSG2_SCRATCHDISK", state: ReplicaState.Being_Deleted },
            { rse: "BNL-OSG2_SCRATCHDISK", state: ReplicaState.Bad },
            { rse: "BNL-OSG2_SCRATCHDISK", state: ReplicaState.Temporary_Unavailable },
        ],
        pageSize: 10,
        fetchStatus: "idle"
    }
}