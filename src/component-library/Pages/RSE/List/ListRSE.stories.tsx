import { StoryFn, Meta } from '@storybook/react';
import { fixtureRSEViewModel } from '../../../../../test/fixtures/table-fixtures';
import { ListRSE as L } from './ListRSE';
import { Toaster } from '@/component-library/ui/toaster';
import { useToast } from '@/component-library/hooks/use-toast';
import { useEffect } from 'react';
import { getDecoratorWithWorker } from '../../../../../test/mocks/handlers/storyDecorators';
import { getMockStreamEndpoint } from '../../../../../test/mocks/handlers/streamingHandlers';
import { getMockErrorEndpoint } from '../../../../../test/mocks/handlers/errorHandlers';

export default {
    title: 'Components/Pages/RSE/List',
    component: L,
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
const hugeArray = Array.from({ length: 100000 }, () => fixtureRSEViewModel());
const endpointUrl = '/api/feature/list-rses';

export const InitialDataNoEndpoint = Template.bind({});
InitialDataNoEndpoint.args = {
    initialData: Array.from({ length: 140 }, () => fixtureRSEViewModel()),
};

export const RegularStreaming = Template.bind({});
RegularStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: Array.from({ length: 140 }, () => fixtureRSEViewModel()),
            delay: 1,
        }),
    ]),
];

export const SlowStreaming = Template.bind({});
SlowStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: Array.from({ length: 140 }, () => fixtureRSEViewModel()),
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

export const InitialExpression = Template.bind({});
InitialExpression.args = {
    firstExpression: 'test',
    initialData: Array.from({ length: 10 }, () => fixtureRSEViewModel()),
};

export const ValidatedExpression = Template.bind({});
ValidatedExpression.args = {
    firstExpression: 'test',
};
ValidatedExpression.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint(endpointUrl, {
            data: Array.from({ length: 10 }, () => fixtureRSEViewModel()),
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
