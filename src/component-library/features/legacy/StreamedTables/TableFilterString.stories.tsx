import { StoryFn, Meta } from '@storybook/nextjs';
import { Column } from '@tanstack/react-table';
import { TableFilterString as T } from './TableFilterString';

export default {
    title: 'Components/StreamedTables',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T> = args => <T {...args} />;

export const TableFilterString = Template.bind({});
TableFilterString.args = {
    column: {
        getFilterValue: () => '',
        setFilterValue: (updater: any) => {},
        id: 'test',
    } as Column<any, string>,
    name: 'Test',
};
