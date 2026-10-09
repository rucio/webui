import { Meta, StoryObj } from '@storybook/react';
import { ClickableRSEExpressionCell } from '../DifferentClickableCells';

const meta: Meta<typeof ClickableRSEExpressionCell> = {
    title: 'Components/Table/ClickableRSEExpressionCell',
    component: ClickableRSEExpressionCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type ClickableRSEExpressionCellStory = StoryObj<typeof ClickableRSEExpressionCell>;
export const ClickableRSEExpressionOnlyOneRSEName: ClickableRSEExpressionCellStory = {
    args: {
        value: 'XRD2',
    },
};
export const ClickableRSEExpressionProper: ClickableRSEExpressionCellStory = {
    args: {
        value: 'XRD1|XRD2|SSH1|CERN-PROD_TZERO',
    },
};
