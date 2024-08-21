import { StoryFn, Meta } from '@storybook/react';
import { PageDIDRules as P } from './PageDIDRules';
import { fixtureDIDRulesViewModel, mockUseComDOM } from 'test/fixtures/table-fixtures';

export default {
    title: 'Components/Pages/DID',
    component: P,
} as Meta<typeof P>;

const Template: StoryFn<typeof P> = args => <P {...args} />;

export const PageDIDRules = Template.bind({});
PageDIDRules.args = {
    comdom: mockUseComDOM(Array.from({ length: 100 }, (_, i) => fixtureDIDRulesViewModel())),
};
