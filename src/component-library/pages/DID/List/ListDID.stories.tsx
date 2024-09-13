import { Meta, StoryFn } from '@storybook/react';
import { ListDID } from './ListDID';
import { fixtureDIDMetaViewModel, fixtureDIDViewModel, fixtureErrorViewModel } from '@/test/fixtures/table-fixtures';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import { getMockStreamEndpoint } from '@/test/mocks/handlers/streaming-handlers';
import { getMockSingleEndpoint } from '@/test/mocks/handlers/single-handlers';
import { DIDType } from '@/lib/core/entity/rucio';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { getMockErrorEndpoint } from '@/test/mocks/handlers/error-handlers';

export default {
    title: 'Components/Pages/DID/List',
    component: ListDID,
    parameters: {
        docs: { disable: true },
    },
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

const listEndpoint = '/api/feature/list-dids';
const metaEndpoint = '/api/feature/get-did-meta';

export const ValidInitialPatternNoEndpoint = Template.bind({});
ValidInitialPatternNoEndpoint.args = {
    firstPattern: 'test:file',
};

export const InvalidInitialPatternNoDelimiter = Template.bind({});
InvalidInitialPatternNoDelimiter.args = {
    firstPattern: 'test',
};

export const InvalidInitialPatternTwoDelimiters = Template.bind({});
InvalidInitialPatternTwoDelimiters.args = {
    firstPattern: 'test:file:line',
};

export const RegularStreaming = Template.bind({});
RegularStreaming.args = {
    firstPattern: 'regular:streaming',
};
RegularStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(listEndpoint, {
            data: Array.from({ length: 200 }, fixtureDIDViewModel),
        }),
        getMockSingleEndpoint(metaEndpoint, {
            getData: () => fixtureDIDMetaViewModel(),
        }),
    ]),
];

const controlledMeta = [fixtureDIDMetaViewModel(DIDType.FILE), fixtureDIDMetaViewModel(DIDType.DATASET), fixtureDIDMetaViewModel(DIDType.CONTAINER)];

const getControlledMetaRetriever = () => {
    let i = 0;
    return () => {
        const meta = controlledMeta[i];
        i++;
        if (i === controlledMeta.length) {
            i = 0;
        }
        return meta;
    };
};

export const SlowMeta = Template.bind({});
SlowMeta.args = {
    firstPattern: 'slow:meta',
};
SlowMeta.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(listEndpoint, {
            data: Array.from({ length: 200 }, fixtureDIDViewModel),
        }),
        getMockSingleEndpoint(metaEndpoint, {
            getData: getControlledMetaRetriever(),
            getDelay: () => 1000,
        }),
    ]),
];

const controlledDelay = [2000, 1000, 500];
const getControlledDelayRetriever = () => {
    let i = 0;
    return () => {
        const meta = controlledDelay[i];
        i++;
        if (i === controlledDelay.length) {
            i = 0;
        }
        return meta;
    };
};

export const IrregularDelayMeta = Template.bind({});
IrregularDelayMeta.args = {
    firstPattern: 'irregular:delay',
};
IrregularDelayMeta.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(listEndpoint, {
            data: Array.from({ length: 200 }, fixtureDIDViewModel),
        }),
        getMockSingleEndpoint(metaEndpoint, {
            getData: getControlledMetaRetriever(),
            getDelay: getControlledDelayRetriever(),
        }),
    ]),
];

export const InitialData = Template.bind({});
InitialData.args = {
    initialData: Array.from({ length: 50 }, fixtureDIDViewModel),
};

const didError: DIDViewModel = {
    scope: '',
    name: '',
    did_type: DIDType.UNKNOWN,
    ...fixtureErrorViewModel(),
};
export const BadInitialData = Template.bind({});
BadInitialData.args = {
    initialData: Array.from({ length: 50 }, () => didError),
};

export const HugeStreaming = Template.bind({});
HugeStreaming.args = {
    firstPattern: 'huge:streaming',
};
HugeStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(listEndpoint, {
            data: Array.from({ length: 20000 }, fixtureDIDViewModel),
            delay: 1,
        }),
        getMockSingleEndpoint(metaEndpoint, {
            getData: () => fixtureDIDMetaViewModel(),
            getDelay: () => 100,
        }),
    ]),
];

export const MetaInvalidModel = Template.bind({});
MetaInvalidModel.args = {
    initialData: Array.from({ length: 20 }, fixtureDIDViewModel),
};
MetaInvalidModel.decorators = [
    getDecoratorWithWorker([
        getMockSingleEndpoint(metaEndpoint, {
            getData: () => fixtureErrorViewModel(),
        }),
    ]),
];

export const MetaResponseError = Template.bind({});
MetaResponseError.args = {
    initialData: Array.from({ length: 20 }, fixtureDIDViewModel),
};
MetaResponseError.decorators = [
    getDecoratorWithWorker([
        getMockErrorEndpoint(metaEndpoint, {
            statusCode: 500,
            message: 'Internal error',
        }),
    ]),
];
