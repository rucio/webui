import { StoryFn, Meta } from '@storybook/react';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { CreateRule } from '@/component-library/pages/Rule/create/CreateRule';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import { getMockStreamEndpoint } from '@/test/mocks/handlers/streaming-handlers';
import { fixtureDIDLongViewModel, fixtureRSEAccountUsageLimitViewModel } from '@/test/fixtures/table-fixtures';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';

export default {
    title: 'Components/Pages/Rule/Create',
    component: CreateRule,
} as Meta<typeof CreateRule>;

const Template: StoryFn<typeof CreateRule> = () => (
    <ToastedTemplate>
        <CreateRule />
    </ToastedTemplate>
);

const noQuotaViewModel: RSEAccountUsageLimitViewModel = {
    account: '',
    bytes_limit: -1,
    bytes_remaining: -1,
    files: -1,
    has_quota: false,
    rse: 'OOPS',
    rse_id: 'oops',
    status: 'success',
    total_expected_usage: -1,
    used_bytes: -1,
};

export const Regular = Template.bind({});
Regular.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint('/api/feature/list-dids', {
            data: Array.from({ length: 200 }, fixtureDIDLongViewModel),
            delay: 1,
        }),
        getMockStreamEndpoint('/api/feature/list-account-rse-quotas', {
            data: [noQuotaViewModel, ...Array.from({ length: 10 }, fixtureRSEAccountUsageLimitViewModel)],
            delay: 1,
            method: 'POST',
        }),
    ]),
];
