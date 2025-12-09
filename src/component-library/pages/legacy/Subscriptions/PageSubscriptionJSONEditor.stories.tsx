import { StoryFn, Meta } from '@storybook/nextjs';
import { fixtureSubscriptionViewModel } from '@/test/fixtures/table-fixtures';
import { PageSubscriptionJSONEditor as P } from './PageSubscriptionJSONEditor';

export default {
    title: 'Components/Pages/Subscriptions',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = args => <P {...args} />;

export const PageSubscriptionJSONEditor = Template.bind({});
PageSubscriptionJSONEditor.args = {
    defaultString: fixtureSubscriptionViewModel().filter,
    submit: (json: string) => {
        console.log(json);
    },
    schemaDescription: 'Expected fields: scope (array of strings), project (array of strings), split_rule (optional boolean)',
};
