import { StoryFn, Meta } from '@storybook/react';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { CreateRule } from '@/component-library/pages/Rule/create/CreateRule';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import { getMockStreamEndpoint } from '@/test/mocks/handlers/streaming-handlers';
import { getMockSingleEndpoint } from '@/test/mocks/handlers/single-handlers';
import { fixtureDIDLongViewModel, fixtureDIDMetaViewModel, fixtureDIDViewModel } from '@/test/fixtures/table-fixtures';
import { RegularStreaming } from '@/component-library/pages/DID/list/ListDID.stories';

export default {
    title: 'Components/Pages/Rule/Create',
    component: CreateRule,
} as Meta<typeof CreateRule>;

const Template: StoryFn<typeof CreateRule> = () => (
    <ToastedTemplate>
        <CreateRule />
    </ToastedTemplate>
);

export const Regular = Template.bind({});
Regular.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint('/api/feature/list-dids', {
            data: Array.from({ length: 200 }, fixtureDIDLongViewModel),
        }),
    ]),
];
