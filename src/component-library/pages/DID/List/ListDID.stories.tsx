import { StoryFn, Meta } from '@storybook/react';
import { ListDID } from './ListDID';
import { fixtureDIDMetaViewModel, fixtureDIDViewModel } from '@/test/fixtures/table-fixtures';
import { DIDMetaViewModel } from '@/lib/infrastructure/data/view-model/did';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/storyDecorators';
import { getMockStreamEndpoint } from '@/test/mocks/handlers/streamingHandlers';

export default {
    title: 'Components/Pages/DID/List',
    component: ListDID,
} as Meta<typeof ListDID>;

const Template: StoryFn<typeof ListDID> = args => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListDID {...args} />
            </ToastedTemplate>
        </QueryClientProvider>
    );
};

const endpointUrl = '/api/feature/list-dids';

export const ValidInitialPatternNoEndpoint = Template.bind({});
ValidInitialPatternNoEndpoint.args = {
    firstPattern: 'test:file',
    queryMeta: async (): Promise<DIDMetaViewModel> => {
        return Promise.resolve(fixtureDIDMetaViewModel());
    },
};

export const InvalidInitialPatternNoDelimiter = Template.bind({});
InvalidInitialPatternNoDelimiter.args = {
    firstPattern: 'test',
    queryMeta: async (): Promise<DIDMetaViewModel> => {
        return Promise.resolve(fixtureDIDMetaViewModel());
    },
};

export const InvalidInitialPatternTwoDelimiters = Template.bind({});
InvalidInitialPatternTwoDelimiters.args = {
    firstPattern: 'test:file:line',
    queryMeta: async (): Promise<DIDMetaViewModel> => {
        return Promise.resolve(fixtureDIDMetaViewModel());
    },
};

export const RegularStreaming = Template.bind({});
RegularStreaming.args = {
    firstPattern: 'test:file',
    queryMeta: async (): Promise<DIDMetaViewModel> => {
        return Promise.resolve(fixtureDIDMetaViewModel());
    },
};
RegularStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: Array.from({ length: 200 }, fixtureDIDViewModel),
        }),
    ]),
];
