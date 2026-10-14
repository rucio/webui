import type { Meta, StoryObj } from '@storybook/nextjs';
import { ListAccountsTips } from './ListAccountsTips';

const meta: Meta<typeof ListAccountsTips> = {
    title: 'Components/Pages/Account/List/ListAccountsTips',
    component: ListAccountsTips,
    parameters: { docs: { disable: true } },
};
export default meta;
export const Default: StoryObj<typeof ListAccountsTips> = {};
