import { StoryFn, Meta } from "@storybook/react";
import { createRandomDIDLong, mockUseComDOM } from "test/fixtures/table-fixtures";
import { PageDIDByType as P } from "./PageDIDByType";

export default {
    title: 'Components/Pages/DID',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageDIDByType = Template.bind({});
PageDIDByType.args = {
    showDIDType: true,
    comdom: mockUseComDOM(Array.from({length: 100}, (_, i) => createRandomDIDLong()))

};
