import { StoryFn, Meta } from '@storybook/nextjs';
import { TabSwitcher } from '@/component-library/features/tabs/TabSwitcher';
import { useState } from 'react';

export default {
    title: 'Components/Tabs',
    component: TabSwitcher,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof TabSwitcher>;

type TemplateArgs = {
    tabs: string[];
};

const Template: StoryFn<TemplateArgs> = ({ tabs }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    return <TabSwitcher tabNames={tabs} activeIndex={activeIndex} onSwitch={setActiveIndex} />;
};

export const DefaultSwitcher = Template.bind({});
DefaultSwitcher.args = {
    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
};

export const ExtendedSwitcher = Template.bind({});
ExtendedSwitcher.args = {
    tabs: ['Hello', 'World', 'Hi', 'Earth'],
};
