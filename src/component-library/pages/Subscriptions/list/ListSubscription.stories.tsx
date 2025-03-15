import { Meta, StoryFn } from '@storybook/react';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { fixtureSubscriptionRuleStatesViewModel } from '@/test/fixtures/table-fixtures';
import { ListSubscription } from '@/component-library/pages/Subscriptions/list/ListSubscription';

export default {
    title: 'Components/Pages/Subscription/List',
    component: ListSubscription,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof ListSubscription>;

const Template: StoryFn<typeof ListSubscription> = args => (
    <ToastedTemplate>
        <ListSubscription {...args} />
    </ToastedTemplate>
);

export const InitialDataNoEndpoint = Template.bind({});
InitialDataNoEndpoint.args = {
    initialData: Array.from({ length: 50 }, () => fixtureSubscriptionRuleStatesViewModel()),
};
