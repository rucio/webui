import { StoryFn, Meta } from "@storybook/react";
import { createDIDDatasetReplicas } from "test/fixtures/table-fixtures";
import { PageDIDDatasetReplicas as P } from "./PageDIDDatasetReplicas";

export default {
	title: 'Components/Pages/PageDID',
	component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageDIDDatasetReplicas = Template.bind({});
PageDIDDatasetReplicas.args = {
	tableData: {
		data: Array.from({length: 100}, (_, i) => createDIDDatasetReplicas()),
		fetchStatus: "idle",
		pageSize: 10
	}
};
