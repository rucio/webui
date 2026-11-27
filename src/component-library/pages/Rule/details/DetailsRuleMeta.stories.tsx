import { Meta, StoryFn } from '@storybook/nextjs';
import { DetailsRuleMeta } from '@/component-library/pages/Rule/details/DetailsRuleMeta';
import { fixtureRuleMetaViewModel } from '@/test/fixtures/table-fixtures';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { RuleState } from '@/lib/core/entity/rucio';

export default {
    title: 'Components/Pages/Rule/Details/Meta',
    component: DetailsRuleMeta,
} as Meta<typeof DetailsRuleMeta>;

const Template: StoryFn<typeof DetailsRuleMeta> = args => (
    <ToastedTemplate>
        <DetailsRuleMeta {...args} />
    </ToastedTemplate>
);

export const RuleWithDates = Template.bind({});
RuleWithDates.args = {
    meta: fixtureRuleMetaViewModel(),
};

export const RuleWithNoExpiry = Template.bind({});
RuleWithNoExpiry.args = {
    meta: {
        ...fixtureRuleMetaViewModel(),
        expires_at: undefined,
    },
};

export const RuleWithNullDates = Template.bind({});
RuleWithNullDates.args = {
    meta: {
        ...fixtureRuleMetaViewModel(),
        created_at: undefined as unknown as string,
        updated_at: undefined as unknown as string,
        expires_at: undefined,
    },
};

export const StuckRule = Template.bind({});
StuckRule.args = {
    meta: {
        ...fixtureRuleMetaViewModel(),
        state: RuleState.STUCK,
        error: 'RequestErrMsg.NO_SOURCES:RequestState.NO_SOURCES',
        stuck_at: '24/06/2026',
    },
};

export const RuleWithChildAndSubscription = Template.bind({});
RuleWithChildAndSubscription.args = {
    meta: {
        ...fixtureRuleMetaViewModel(),
        child_rule_id: '7eb69ef3986740bc964623ade1a740da',
        subscription_id: '593cf54166b243029e8c4bf84b98238f',
    },
};
