import { StoryFn, Meta } from "@storybook/react";
import { createDIDDatasetReplicas, mockUseComDOM } from "test/fixtures/table-fixtures";
import { PageDIDDatasetReplicas as P } from "./PageDIDDatasetReplicas";

export default {
	title: 'Components/Pages/DID',
	component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageDIDDatasetReplicas = Template.bind({});
PageDIDDatasetReplicas.args = {
	comdom: mockUseComDOM(Array.from({ length: 100 }, (_, i) => createDIDDatasetReplicas()))
};
