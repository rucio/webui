import { StoryFn, Meta } from '@storybook/react';
import { Column } from '@tanstack/react-table';
import { TableFilterDiscrete as T } from './TableFilterDiscrete';

export default {
    title: 'Components/StreamedTables',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T<string>> = args => <T<string> {...args} />; // yes this is how you use JSX.Element generics

export const TableFilterDiscrete = Template.bind({});
TableFilterDiscrete.args = {
    name: 'Label',
    keys: ['a', 'b', 'c'],
    column: {
        setFilterValue: (filter: string | undefined) => {
            console.log(filter);
        },
    } as Column<unknown, string>,
    renderFunc: (key: string | undefined) => {
        return <span>{key ?? 'HOHOHOHO UNDEFINED'}</span>;
    },
};
