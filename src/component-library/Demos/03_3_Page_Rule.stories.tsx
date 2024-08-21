import { RulePageLockEntryViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { Meta, StoryObj } from '@storybook/react';
import { fixtureRuleMetaViewModel, fixtureRulePageLockEntryViewModel, fixtureRuleViewModel, mockUseComDOM } from 'test/fixtures/table-fixtures';
import { PageRule as PR } from '../Pages/Rule/PageRule';

export default {
    title: 'Demos/05_PageRule',
    component: PR,
} as Meta<typeof PR>;

type Story = StoryObj<typeof PR>;

export const PageRule: Story = {
    args: {
        ruleMeta: fixtureRuleMetaViewModel(),
        ruleLocks: mockUseComDOM<RulePageLockEntryViewModel>(Array.from({ length: 100 }, () => fixtureRulePageLockEntryViewModel())),
        ruleBoostFunc: () => {
            console.log('boosted rule');
        },
        ruleBoostShow: true,
    },
};
