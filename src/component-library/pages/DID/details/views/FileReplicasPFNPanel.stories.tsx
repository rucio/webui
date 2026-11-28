import { Meta, StoryFn } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FileReplicasPFNPanel } from './FileReplicasPFNPanel';
import { fixtureFilereplicaStateViewModel } from '@/test/fixtures/table-fixtures';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import { getMockStreamEndpoint } from '@/test/mocks/handlers/streaming-handlers';
import { getMockSingleEndpoint } from '@/test/mocks/handlers/single-handlers';
import { getMockErrorEndpoint } from '@/test/mocks/handlers/error-handlers';

export default {
    title: 'Components/Pages/DID/Details/FileReplicasPFN',
    component: FileReplicasPFNPanel,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof FileReplicasPFNPanel>;

const Template: StoryFn<typeof FileReplicasPFNPanel> = args => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <div className="flex flex-col h-[calc(100vh-4rem)]">
                    <FileReplicasPFNPanel {...args} />
                </div>
            </ToastedTemplate>
        </QueryClientProvider>
    );
};

const listEndpoint = '/api/feature/list-file-replicas';
const metalinkEndpoint = '/api/feature/get-file-replicas-metalink';
const metalink = '<?xml version="1.0" encoding="UTF-8"?>\n<metalink xmlns="urn:ietf:params:xml:ns:metalink"></metalink>\n';

const args = { scope: 'test', name: 'file1', isActive: true, idPrefix: 'story' };

export const Default = Template.bind({});
Default.args = args;
Default.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(listEndpoint, { data: Array.from({ length: 8 }, fixtureFilereplicaStateViewModel) }),
        getMockSingleEndpoint(metalinkEndpoint, { getData: () => ({ status: 'success', xml: metalink }) }),
    ]),
];

export const WithoutPFNs = Template.bind({});
WithoutPFNs.args = args;
WithoutPFNs.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(listEndpoint, {
            data: Array.from({ length: 3 }, () => ({
                ...fixtureFilereplicaStateViewModel(),
                pfn: null,
                protocol: null,
                domain: null,
                priority: null,
                rseType: null,
            })),
        }),
    ]),
];

export const SlowStreaming = Template.bind({});
SlowStreaming.args = args;
SlowStreaming.decorators = [
    getDecoratorWithWorker([getMockStreamEndpoint(listEndpoint, { data: Array.from({ length: 500 }, fixtureFilereplicaStateViewModel), delay: 1 })]),
];

export const InvalidRSEExpression = Template.bind({});
InvalidRSEExpression.args = args;
InvalidRSEExpression.decorators = [
    getDecoratorWithWorker([
        getMockErrorEndpoint(listEndpoint, { statusCode: 400, message: 'RSE Expression resulted in an empty set.' }),
        getMockErrorEndpoint(metalinkEndpoint, { statusCode: 400, message: 'RSE Expression resulted in an empty set.' }),
    ]),
];
