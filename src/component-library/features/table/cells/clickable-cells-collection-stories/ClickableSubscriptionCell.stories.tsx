import { Meta, StoryObj } from '@storybook/react';
import { ClickableSubscriptionCell } from '../ClickableCellsCollection';

const meta: Meta<typeof ClickableSubscriptionCell> = {
    title: 'Components/Table/ClickableSubscriptionCell',
    component: ClickableSubscriptionCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type ClickableSubscriptionCellStory = StoryObj<typeof ClickableSubscriptionCell>;
export const ClickableSubscription: ClickableSubscriptionCellStory = {
    args: {
        account: 'root',
        value: 'my-subscription',
    },
};
