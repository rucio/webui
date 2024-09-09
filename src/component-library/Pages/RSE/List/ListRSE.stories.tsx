import { StoryFn, Meta } from '@storybook/react';
import { fixtureErrorViewModel, fixtureRSEViewModel } from '@/test/fixtures/table-fixtures';
import { ListRSE as L } from './ListRSE';
import { Toaster } from '@/component-library/ui/toaster';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { useEffect } from 'react';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/storyDecorators';
import {
    getMockInvalidStreamEndpoint,
    getMockPartialStreamEndpoint,
    getMockStreamEndpoint,
} from '@/test/mocks/handlers/streamingHandlers';
import { getMockErrorEndpoint } from '@/test/mocks/handlers/errorHandlers';

export default {
    title: 'Components/Pages/RSE/List',
    component: L,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = args => {
    const { dismiss } = useToast();

    useEffect(() => {
        return () => dismiss();
    }, []);

    return (
        <div className="flex flex-col h-screen dark:bg-neutral-900">
            <L {...args} />
            <Toaster />
        </div>
    );
};

// We don't want to generate several of these
const hugeArray = Array.from({ length: 100000 }, fixtureRSEViewModel);
const endpointUrl = '/api/feature/list-rses';

export const InitialDataNoEndpoint = Template.bind({});
InitialDataNoEndpoint.args = {
    initialData: Array.from({ length: 140 }, fixtureRSEViewModel),
};

export const RegularStreaming = Template.bind({});
RegularStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: Array.from({ length: 140 }, fixtureRSEViewModel),
            delay: 1,
        }),
    ]),
];

export const SlowStreaming = Template.bind({});
SlowStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: Array.from({ length: 140 }, fixtureRSEViewModel),
            delay: 200,
        }),
    ]),
];

export const HugeStreaming = Template.bind({});
HugeStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: hugeArray,
            delay: 1,
        }),
    ]),
];

export const InstantStreaming = Template.bind({});
InstantStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: hugeArray,
        }),
    ]),
];

export const InitialValidatedExpression = Template.bind({});
InitialValidatedExpression.args = {
    firstExpression: 'test',
};
InitialValidatedExpression.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: Array.from({ length: 10 }, fixtureRSEViewModel),
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

export const ParsingError = Template.bind({});
ParsingError.decorators = [getDecoratorWithWorker([getMockInvalidStreamEndpoint(endpointUrl)])];

export const PartialStreaming = Template.bind({});
PartialStreaming.decorators = [
    getDecoratorWithWorker([
        getMockPartialStreamEndpoint(endpointUrl, {
            data: Array.from({ length: 140 }, fixtureRSEViewModel),
        }),
    ]),
];
