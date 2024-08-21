import { BaseViewModel } from '@/lib/sdk/view-models';
import { StoryFn, Meta } from '@storybook/react';
import { TableErrorstatus as T } from './TableErrorstatus';
import { mockUseComDOM } from 'test/fixtures/table-fixtures';

export default {
    title: 'Components/StreamedTables',
    component: T,
} as Meta<typeof T>;

const Template: StoryFn<typeof T> = args => <T {...args} />;

export const TableErrorstatus = Template.bind({});
TableErrorstatus.args = {
    comdom: mockUseComDOM<BaseViewModel>([
        {
            status: 'error',
            message: 'This is an error message',
        },
    ]),
};
