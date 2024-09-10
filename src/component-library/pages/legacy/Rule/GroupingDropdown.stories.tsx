import { StoryFn, Meta } from '@storybook/react';

import { Dropdown as D } from './GroupingDropdown';

export default {
    title: 'Components/Pages/Rule/Components',
    component: D,
} as Meta<typeof D>;

const Template: StoryFn<typeof D> = args => <D {...args} />;

export const Dropdown = Template.bind({});
Dropdown.args = {
    handleChange: (args: any) => {},
};
