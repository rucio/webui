import { Meta, StoryObj } from '@storybook/react';
import { ClickableRSECell } from '../DifferentClickableCells';

const meta: Meta<typeof ClickableRSECell> = {
    title: 'Components/Table/ClickableRSECell',
    component: ClickableRSECell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type ClickableRSECellStory = StoryObj<typeof ClickableRSECell>;
export const ClickableRSE: ClickableRSECellStory = {
    args: {
        value: 'XRD1',
    },
};
