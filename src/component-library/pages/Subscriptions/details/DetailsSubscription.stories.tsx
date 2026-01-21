import { Meta, StoryFn } from '@storybook/nextjs';
import { DetailsSubscription } from './DetailsSubscription';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { fixtureSubscriptionViewModel } from '@/test/fixtures/table-fixtures';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import { getMockSingleEndpoint } from '@/test/mocks/handlers/single-handlers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default {
    title: 'Components/Pages/Subscription/Details',
    component: DetailsSubscription,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof DetailsSubscription>;

const Template: StoryFn<typeof DetailsSubscription> = args => {
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
                <DetailsSubscription {...args} />
            </ToastedTemplate>
        </QueryClientProvider>
    );
};

export const SubscriptionDetails = Template.bind({});
SubscriptionDetails.args = {
    account: 'jdoe',
    name: 'test.subscription',
};
SubscriptionDetails.decorators = [
    getDecoratorWithWorker([
        getMockSingleEndpoint('/api/feature/get-subscription', {
            getData: () => fixtureSubscriptionViewModel(),
        }),
    ]),
];

export const SubscriptionDetailsError = Template.bind({});
SubscriptionDetailsError.args = {
    account: 'jdoe',
    name: 'test.subscription',
};
SubscriptionDetailsError.decorators = [
    getDecoratorWithWorker([
        getMockSingleEndpoint('/api/feature/get-subscription', {
            getData: () => ({ status: 'error', message: 'Failed to load subscription' }),
        }),
    ]),
];
