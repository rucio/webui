import { Meta, StoryFn } from '@storybook/react';
import { fixtureErrorViewModel, fixtureRSEViewModel } from '@/test/fixtures/table-fixtures';
import { ListRSE } from './ListRSE';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import {
    getMockInvalidStreamEndpoint,
    getMockPartialStreamEndpoint,
    getMockStreamEndpoint,
    getMockValidBeforeFailStreamEndpoint,
} from '@/test/mocks/handlers/streaming-handlers';
import { getMockErrorEndpoint } from '@/test/mocks/handlers/error-handlers';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { RSEViewModel } from '@/lib/core/view-model/list-rse';
import { RSEType } from '@/lib/core/entity/rucio';

export default {
    title: 'Components/Pages/RSE/List',
    component: ListRSE,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof ListRSE>;

const Template: StoryFn<typeof ListRSE> = args => (
    <ToastedTemplate>
        <ListRSE {...args} />
    </ToastedTemplate>
);

// We don't want to generate several of these
const smallList = Array.from({ length: 20 }, fixtureRSEViewModel);
const mediumList = Array.from({ length: 140 }, fixtureRSEViewModel);
const hugeList = Array.from({ length: 100000 }, fixtureRSEViewModel);
const endpointUrl = '/api/feature/list-rses';

export const InitialDataNoEndpoint = Template.bind({});
InitialDataNoEndpoint.args = {
    initialData: mediumList,
};

export const RegularStreaming = Template.bind({});
RegularStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: mediumList,
            delay: 1,
        }),
    ]),
];

export const SlowStreaming = Template.bind({});
SlowStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: mediumList,
            delay: 200,
        }),
    ]),
];

export const HugeStreaming = Template.bind({});
HugeStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: hugeList,
            delay: 1,
        }),
    ]),
];

export const InstantStreaming = Template.bind({});
InstantStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: hugeList,
        }),
    ]),
];

export const InitialValidatedExpression = Template.bind({});
InitialValidatedExpression.args = {
    initialExpression: 'test',
};
InitialValidatedExpression.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: smallList,
            isRequestValid: request => {
                const url = new URL(request.url);
                const expression = url.searchParams.get('rseExpression');
                return expression === 'test';
            },
        }),
    ]),
];

export const NotFound = Template.bind({});
NotFound.decorators = [
    getDecoratorWithWorker([
        getMockErrorEndpoint(endpointUrl, {
            statusCode: 404,
            message: 'No RSEs found.',
        }),
    ]),
];

export const NoValidData = Template.bind({});
NoValidData.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: Array.from({ length: 50 }, fixtureErrorViewModel),
            delay: 10,
        }),
    ]),
];

export const SomeInvalidData = Template.bind({});
SomeInvalidData.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: [...Array.from({ length: 20 }, fixtureErrorViewModel), ...Array.from({ length: 30 }, fixtureRSEViewModel)],
        }),
    ]),
];

export const FullParsingError = Template.bind({});
FullParsingError.decorators = [getDecoratorWithWorker([getMockInvalidStreamEndpoint(endpointUrl)])];

export const PartialParsingError = Template.bind({});
PartialParsingError.decorators = [
    getDecoratorWithWorker([getMockValidBeforeFailStreamEndpoint(endpointUrl, Array.from({ length: 5 }, fixtureRSEViewModel))]),
];

export const PartialStreaming = Template.bind({});
PartialStreaming.decorators = [
    getDecoratorWithWorker([
        getMockPartialStreamEndpoint(endpointUrl, {
            data: mediumList,
        }),
    ]),
];

const rseError: RSEViewModel = {
    deterministic: false,
    id: '',
    name: '',
    rse_type: RSEType.UNKNOWN,
    staging_area: false,
    volatile: false,
    ...fixtureErrorViewModel(),
};
export const BadInitialData = Template.bind({});
BadInitialData.args = {
    initialData: Array.from({ length: 20 }, () => rseError),
};
