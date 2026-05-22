import { StoryFn, Meta } from '@storybook/nextjs';
import { fixtureSuspiciousReplicaViewModel } from '@/test/fixtures/table-fixtures';
import { ListSuspiciousReplicas } from '@/component-library/pages/Replica/suspicious/ListSuspiciousReplicas';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default {
    title: 'Components/Pages/Replica/ListSuspiciousReplicas',
    component: ListSuspiciousReplicas,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof ListSuspiciousReplicas>;

const Template: StoryFn<typeof ListSuspiciousReplicas> = args => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ToastedTemplate>
                <ListSuspiciousReplicas {...args} />
            </ToastedTemplate>
        </QueryClientProvider>
    );
};

/** Empty grid — no initial data and no streaming endpoint. */
export const Empty = Template.bind({});
Empty.args = {};

/** Grid pre-populated with static mock data (no network calls). */
export const WithData = Template.bind({});
WithData.args = {
    initialData: Array.from({ length: 30 }, () => fixtureSuspiciousReplicaViewModel()),
};
