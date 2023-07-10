import { StoryFn, Meta } from "@storybook/react";
import { PageDID as PD } from "./PageDID";

import { DIDSearchQuery } from "@/lib/infrastructure/data/view-model/create-rule";
import { DIDType, DIDAvailability } from '@/lib/core/entity/rucio';
import { createDIDMeta, mockUseComDOM, createDIDRules, createDID, createDIDDatasetReplicas, createFileReplicaState, createFileReplicaStateD } from "test/fixtures/table-fixtures";

export default {
    title: "Components/Pages/PageDID",
    component: PD,
} as Meta<typeof PD>;

const Template: StoryFn<typeof PD> = (args) => <PD {...args} />;
export const PageDID = Template.bind({});
PageDID.args = {
    didMeta: createDIDMeta(),
    fromDidList: "yosearch",
    // Parent DIDs [FILE]
    didParentsComDOM: mockUseComDOM(Array.from({length: 100}, (_, i) => createDID())),
    // DID Metadata
    didMetadataComDOM: mockUseComDOM([
        { key: "bernd", value: "das brot" },
        { key: "kika", value: "der sender" },
        { key: "kikaninchen", value: "das tier" },
        { key: "my birthday", value: (new Date(2021, 3)).toISOString() },
        { key: "am_i_anton", value: false },
        { key: "R1-tastefactor", value: 3.142 },
        { key: "hello", value: null },
    ]),
    // Filereplicas
    didFileReplicasComDOM: mockUseComDOM(Array.from({ length: 100 }, (_, i) => createFileReplicaState())),
    didFileReplicasDComDOM: mockUseComDOM(Array.from({ length: 100 }, (_, i) => createFileReplicaStateD())),
    didRulesComDOM: mockUseComDOM(Array.from({ length: 100 }, (_, i) => createDIDRules())),
    // Contents
    didContentsComDOM: mockUseComDOM(Array.from({ length: 100 }, (_, i) => createDID())),
    didDatasetReplicasComDOM: mockUseComDOM(Array.from({ length: 100 }, (_, i) => createDIDDatasetReplicas()))
}