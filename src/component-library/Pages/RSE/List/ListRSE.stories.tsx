import { StoryFn, Meta } from '@storybook/react';
import { fixtureRSEViewModel } from '../../../../../test/fixtures/table-fixtures';
import { ListRSE as L } from './ListRSE';
import { Toaster } from '@/component-library/ui/toaster';

export default {
    title: 'Components/Pages/RSE/List',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = args => (
    <div className="flex flex-col h-screen">
        <L {...args} />
        <Toaster />
    </div>
);

export const InitialDataNoEndpoint = Template.bind({});
InitialDataNoEndpoint.args = {
    initialData: Array.from({ length: 100 }, () => fixtureRSEViewModel()),
};
