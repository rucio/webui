import { AccountType } from '@/lib/core/entity/rucio';
import { RuleSummaryViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { StoryFn, Meta } from '@storybook/react';
import { fixtureListDIDViewModel, fixtureRSEAccountUsageLimitViewModel } from '@/test/fixtures/table-fixtures';
import { SummaryPage as SP } from './SummaryPage';

export default {
    title: 'Components/Pages/Rule/Components',
    component: SP,
} as Meta<typeof SP>;

const Template: StoryFn<typeof SP> = args => <SP {...args} />;

export const SummaryPage = Template.bind({});
SummaryPage.args = {
    data: {
        status: 'success',
        DIDViewModels: [fixtureListDIDViewModel(), fixtureListDIDViewModel()],
        RSEViewModels: [fixtureRSEAccountUsageLimitViewModel()],
        expirydate: new Date(),
        notifications: false,
        asynchronousMode: false,
        numcopies: 0,
        numsamples: -1,
        groupby: 'File',
        comment: '',
        accountInfo: {
            account: 'root',
            accountType: AccountType.USER,
            email: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    } as RuleSummaryViewModel,
};
