import { StoryFn, Meta } from '@storybook/react';
import { PageDIDMetadata as P } from "./PageDIDMetadata"

export default {
    title: "Components/Pages/PageDID",
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = (args) => <P {...args} />;

export const PageDIDMetadata = Template.bind({});
PageDIDMetadata.args = {
    tableData: {
        data: [
            { key: "bernd", value: "das brot" },
            { key: "kika", value: "der sender" },
            { key: "kikaninchen", value: "das tier" },
            { key: "my birthday", value: new Date(2021, 3) },
            { key: "am_i_anton", value: false },
            { key: "R1-tastefactor", value: 3.142 },
            { key: "hello", value: null },
        ],
        pageSize: 10,
        fetchStatus: "idle"
    }
}