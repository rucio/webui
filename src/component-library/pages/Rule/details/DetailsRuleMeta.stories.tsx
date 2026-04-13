import { Meta, StoryFn } from '@storybook/nextjs';
import { DetailsRuleMeta } from '@/component-library/pages/Rule/details/DetailsRuleMeta';
import { fixtureRuleMetaViewModel } from '@/test/fixtures/table-fixtures';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';

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
