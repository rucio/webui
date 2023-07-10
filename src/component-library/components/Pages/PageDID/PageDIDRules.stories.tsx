import { StoryFn, Meta } from "@storybook/react";
import { PageDIDRules as P } from "./PageDIDRules";
import { createDIDRules, mockUseComDOM } from "test/fixtures/table-fixtures";

export default {
    title: 'components/Pages/PageDID',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageDIDRules = Template.bind({});
PageDIDRules.args = {
    comdom: mockUseComDOM(Array.from({length: 100}, (_, i) => createDIDRules())),
};
