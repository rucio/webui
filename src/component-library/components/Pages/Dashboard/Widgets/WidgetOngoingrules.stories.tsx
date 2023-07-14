import { StoryFn, Meta } from "@storybook/react";
import { fixtureOngoingrules } from "test/fixtures/widget-fixtures";
import { WidgetOngoingrules as W } from "./WidgetOngoingrules";

export default {
    title: 'Components/Pages/Dashboard/Widgets',
    component: W,
} as Meta<typeof W>;

const Template: StoryFn<typeof W> = (args) => <W {...args} />;

export const WidgetOngoingrules = Template.bind({});
WidgetOngoingrules.args = {
    input: Array.from({length: 10}, (v,k) => fixtureOngoingrules())
};
