import { Meta, StoryObj } from '@storybook/react';
import { fixtureSubscriptionViewModel } from 'test/fixtures/table-fixtures';
import { PageSubscription as P } from '@/component-library/pages/legacy/Subscriptions/PageSubscription';

export default {
    title: 'Demos/07_PageSubscription',
    component: P,
} as Meta<typeof P>;

type Story = StoryObj<typeof P>;

export const ListSubscription: Story = {
    args: {
        subscriptionViewModel: fixtureSubscriptionViewModel(),
    },
};
