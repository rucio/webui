import { Meta, StoryObj } from '@storybook/react';
import { ClickableAccountCell } from '../ClickableCellsCollection';

const meta: Meta<typeof ClickableAccountCell> = {
    title: 'Components/Table/ClickableAccountCell',
    component: ClickableAccountCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type ClickableAccountCellStory = StoryObj<typeof ClickableAccountCell>;
export const ClickableAccount: ClickableAccountCellStory = {
    args: {
        value: 'jdoe',
    },
};
