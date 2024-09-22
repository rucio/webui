import { StoryFn, Meta } from '@storybook/react';
import { fixtureRuleViewModel } from '@/test/fixtures/table-fixtures';
import { ListRule } from '@/component-library/pages/Rule/list/ListRule';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import { getMockStreamEndpoint } from '@/test/mocks/handlers/streaming-handlers';

export default {
    title: 'Components/Pages/Rule/List',
    component: ListRule,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof ListRule>;

const Template: StoryFn<typeof ListRule> = args => (
    <ToastedTemplate>
        <ListRule {...args} />
    </ToastedTemplate>
);

export const InitialDataNoEndpoint = Template.bind({});
InitialDataNoEndpoint.args = {
    initialData: Array.from({ length: 50 }, () => fixtureRuleViewModel()),
};

export const RegularStreaming = Template.bind({});
RegularStreaming.decorators = [
    getDecoratorWithWorker([
        getMockStreamEndpoint('/api/feature/list-rules', {
            data: Array.from({ length: 500 }, fixtureRuleViewModel),
            delay: 1,
        }),
    ]),
];
