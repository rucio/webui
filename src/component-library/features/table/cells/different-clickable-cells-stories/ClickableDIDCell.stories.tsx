import { Meta, StoryObj } from '@storybook/react';
import { ClickableDIDCell } from '../DifferentClickableCells';

const meta: Meta<typeof ClickableDIDCell> = {
    title: 'Components/Table/ClickableDID',
    component: ClickableDIDCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type ClickableDIDCellStory = StoryObj<typeof ClickableDIDCell>;
export const ClickableDID: ClickableDIDCellStory = {
    args: {
        value: ['test', 'dataset1'],
    },
};
