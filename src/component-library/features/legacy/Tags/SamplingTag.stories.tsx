import { StoryFn, Meta } from '@storybook/react';

import { SamplingTag as S } from './SamplingTag';

export default {
    title: 'Components/Tags',
    component: S,
} as Meta<typeof S>;

const Template: StoryFn<typeof S> = args => <S {...args} />;

export const SamplingTag = Template.bind({});
SamplingTag.args = {
    sampling: true,
};
