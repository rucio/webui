import { Meta, StoryFn } from '@storybook/react';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { fixtureSubscriptionRuleStatesViewModel } from '@/test/fixtures/table-fixtures';
import { ListSubscription } from '@/component-library/pages/Subscriptions/list/ListSubscription';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import { getMockStreamEndpoint } from '@/test/mocks/handlers/streaming-handlers';
import { getMockSingleEndpoint } from '@/test/mocks/handlers/single-handlers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default {
    title: 'Components/Pages/Subscription/List',
    component: ListSubscription,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof ListSubscription>;

const Template: StoryFn<typeof ListSubscription> = args => {
    const queryClient = new QueryClient();

    const [loading, setLoading] = useState(true);

    // Wait for the mocking to be enabled
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return <div>Loading the mocking engine...</div>;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListSubscription {...args} />
            </ToastedTemplate>
        </QueryClientProvider>
    );
};

export const InitialDataNoEndpoint = Template.bind({});
InitialDataNoEndpoint.args = {
    initialData: Array.from({ length: 50 }, () => fixtureSubscriptionRuleStatesViewModel()),
};
InitialDataNoEndpoint.decorators = [
    getDecoratorWithWorker([
        getMockSingleEndpoint('/api/feature/get-site-header', {
            getData: () => ({
                activeAccount: {
                    rucioAccount: 'jdoe',
                },
            }),
        }),
    ]),
];

export const RegularStreaming = Template.bind({});
RegularStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint('/api/feature/list-subscription-rule-states', {
            data: Array.from({ length: 500 }, fixtureSubscriptionRuleStatesViewModel),
            delay: 5,
        }),
        getMockSingleEndpoint('/api/feature/get-site-header', {
            getData: () => ({
                activeAccount: {
                    rucioAccount: 'jdoe',
                },
            }),
        }),
    ]),
];
