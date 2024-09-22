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
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof CreateRule>;

const Template: StoryFn<typeof CreateRule> = () => (
    <ToastedTemplate>
        <CreateRule />
    </ToastedTemplate>
);

const staticRses: RSEAccountUsageLimitViewModel[] = [
    {
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
    },
    {
        account: '',
        // ~ 10 TB
        bytes_limit: 10 ** 13,
        bytes_remaining: 10 ** 13,
        files: -1,
        has_quota: true,
        rse: 'RSE-FULL',
        rse_id: 'rse-full',
        status: 'success',
        total_expected_usage: 0,
        used_bytes: 0,
    },
    {
        account: '',
        bytes_limit: 1000,
        bytes_remaining: -100,
        files: -1,
        has_quota: false,
        rse: 'RSE-LACKING',
        rse_id: 'rse-lacking',
        status: 'success',
        total_expected_usage: 900,
        used_bytes: 800,
    },
];

export const Regular = Template.bind({});
Regular.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint('/api/feature/list-dids', {
            data: Array.from({ length: 200 }, fixtureDIDLongViewModel),
            delay: 1,
        }),
        getMockStreamEndpoint('/api/feature/list-account-rse-quotas', {
            data: staticRses,
            delay: 1,
            method: 'POST',
        }),
    ]),
];
