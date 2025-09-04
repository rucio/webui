import { DIDType } from '@/lib/core/entity/rucio';
import type { StoryFn, Meta } from '@storybook/react';
import { DIDTypeTag } from '@/component-library/features/legacy/Tags/DIDTypeTag';
import { Heading as H } from './Heading';

export default {
    title: 'Components/Pages/Helpers',
    component: H,
} as Meta<typeof H>;

const Template: StoryFn<typeof H> = args => <H {...args} />;

export const Heading = Template.bind({});
Heading.args = {
    title: 'Hello',
    subtitle: 'Subtitle!!! Look at this',
    tag: <DIDTypeTag didtype={DIDType.DATASET} />,
    children: <div>World</div>,
};
