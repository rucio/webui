import { RuleState } from '@/lib/core/entity/rucio';
import { StoryFn, Meta } from '@storybook/react';
import { RuleStateTag } from '@/component-library/features/legacy/Tags/RuleStateTag';
import { Dropdown as D } from './Dropdown';

export default {
    title: 'Components/Input',
    component: D,
} as Meta<typeof D>;

const Template: StoryFn<typeof D<RuleState>> = args => <D<RuleState> {...args} />;

export const Dropdown = Template.bind({});
Dropdown.args = {
    keys: Object.values(RuleState),
    renderFunc: (key: RuleState | undefined) => {
        return key ? <RuleStateTag state={key} /> : <span>UNDEFINED</span>;
    },
    handleChange: (key: RuleState | undefined) => {},
};
