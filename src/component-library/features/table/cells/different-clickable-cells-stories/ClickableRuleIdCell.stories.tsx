import { Meta, StoryObj } from '@storybook/react';
import { ClickableRuleIdCell } from '../DifferentClickableCells';

const meta: Meta<typeof ClickableRuleIdCell> = {
    title: 'Components/Table/ClickableRuleId',
    component: ClickableRuleIdCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type ClickableRuleCellStory = StoryObj<typeof ClickableRuleIdCell>;
export const ClickableRuleId: ClickableRuleCellStory = {
    args: {
        value: '7eb69ef3986740bc964623ade1a740da',
    },
};
