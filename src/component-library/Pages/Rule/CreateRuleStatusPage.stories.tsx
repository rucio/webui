import { StoryFn, Meta } from '@storybook/react';
import React from 'react';

import { CreateRuleStatusPage, TCreateRuleStatusPageProps } from './CreateRuleStatusPage';

export default {
  title: 'Components/Pages/Rule/CreateRuleStatusPage',
  component: CreateRuleStatusPage,
} as Meta<typeof CreateRuleStatusPage>;

const Template: StoryFn<typeof CreateRuleStatusPage> = (args) => <CreateRuleStatusPage {...args} />


export const Story = Template.bind({});
Story.args = {
  createRuleViewModel: {
    status: 'error',
    message: 'There has been an error my ser!',
    rules : {}
  },
} as TCreateRuleStatusPageProps;
