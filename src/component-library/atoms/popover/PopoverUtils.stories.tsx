import { Meta, StoryFn } from '@storybook/react';
import { PopoverRow, popoverVariants } from './PopoverUtils';
import { cn } from '@/component-library/utils';

const meta: Meta = {
    title: 'Atoms/Popover/PopoverRow',
    component: PopoverRow,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof PopoverRow> = args => (
    <div className={cn('max-w-[300px]', popoverVariants({ variant: args.variant }))}>
        <PopoverRow {...args} />
    </div>
);

export const DefaultPopoverRow = Template.bind({});
DefaultPopoverRow.args = {
    label: 'Name',
    value: 'my-row',
    variant: 'default',
};

export const InfoPopoverRow = Template.bind({ arrowFill: 'info' });
InfoPopoverRow.args = {
    label: 'Account',
    value: 'root',
    variant: 'info',
};

export const SuccessPopoverRow = Template.bind({});
SuccessPopoverRow.args = {
    label: 'Status',
    value: String(200),
    variant: 'success',
};

export const ErrorBreakAllPopoverRow = Template.bind({ arrowFill: 'error' });
ErrorBreakAllPopoverRow.args = {
    label: 'Error',
    value: 'RequestErrMsg.NO_SOURCES:RequestState.NO_SOURCES',
    variant: 'error',
    breakValue: 'break-all',
};

export const WarningPopoverRow = Template.bind({});
WarningPopoverRow.args = {
    label: 'Data format',
    value: 'string | ' + String(null),
    variant: 'warning',
};

export const NeutralBreakAllPopoverRow = Template.bind({});
NeutralBreakAllPopoverRow.args = {
    label: 'ID',
    value: '593cf54166b243029e8c4bf84b98238f',
    variant: 'neutral',
    breakValue: 'break-all',
};

export const LabelAndValueClassesModifiedRow = Template.bind({});
LabelAndValueClassesModifiedRow.args = {
    label: 'font-bold',
    value: 'text-brand-900',
    variant: 'neutral',
    labelClassName: 'font-bold',
    valueClassName: 'text-brand-900',
};
