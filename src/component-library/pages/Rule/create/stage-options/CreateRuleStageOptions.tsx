import { CreateRuleGrouping, CreateRuleOptions, CreateRuleParameters } from '@/lib/infrastructure/data/view-model/rule';
import { cn } from '@/component-library/utils';
import React, { ChangeEvent, FormEvent } from 'react';
import { Input, Textarea } from '@/component-library/atoms/form/input';
import { LabeledCheckbox } from '@/component-library/features/form/LabeledCheckbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { WarningField } from '@/component-library/features/fields/WarningField';

interface FieldWithLabelProps {
    label: string;
    children: React.ReactNode;
    className?: string;
    required?: boolean;
}

const InputWithLabel: React.FC<FieldWithLabelProps> = ({ label, children, className, required }) => {
    return (
        <div className={cn('space-y-1', className)}>
            <label className="text-neutral-900 dark:text-neutral-100">
                {label}
                {required && <span className="text-base-error-500 font-medium ml-1">*</span>}
            </label>
            {children}
        </div>
    );
};

export type CreateRuleOptionsErrors = {
    tooManyCopies: boolean;
    copiesInvalid: boolean;
    lifetimeInvalid: boolean;
    lifetimeScratchDisk: boolean;
    commentsEmpty: boolean;
    groupingInvalid: boolean;
};

export const getEmptyOptionsErrors = (): CreateRuleOptionsErrors => {
    return {
        commentsEmpty: false,
        copiesInvalid: false,
        groupingInvalid: false,
        lifetimeInvalid: false,
        lifetimeScratchDisk: false,
        tooManyCopies: false,
    };
};

type CreateRuleStageOptionsProps = {
    parameters: CreateRuleParameters;
    updateOptionValue: (key: keyof CreateRuleOptions, value: any) => void;
    errors: CreateRuleOptionsErrors;
};

const UNDEFINED_GROUPING = 'undefined';

export const CreateRuleStageOptions = ({ parameters, updateOptionValue, errors }: CreateRuleStageOptionsProps) => {
    const onLifetimeInput = (event: FormEvent<HTMLInputElement>) => {
        let value;
        if (event.currentTarget.validity.valid) {
            value = event.currentTarget.value === '' ? undefined : parseInt(event.currentTarget.value, 10);
        } else {
            value = NaN;
        }
        updateOptionValue('daysLifetime', value);
    };

    const onCopiesInput = (event: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        updateOptionValue('copies', value);
    };

    const defaultCopies = isNaN(parameters.copies) ? '' : parameters.copies;
    const getDefaultLifetime = () => {
        if (parameters.daysLifetime === undefined) return '';
        if (isNaN(parameters.daysLifetime)) return -1;
        return parameters.daysLifetime;
    };

    return (
        <div className="flex flex-col space-y-5 w-full grow">
            <InputWithLabel label="Copies" required>
                <Input onChange={onCopiesInput} type="number" min="1" max={parameters.rses.length} defaultValue={defaultCopies} />
            </InputWithLabel>
            <InputWithLabel label="Lifetime (days)">
                <Input onInput={onLifetimeInput} type="number" min="1" defaultValue={getDefaultLifetime()} />
            </InputWithLabel>
            <InputWithLabel label="Comments" required={parameters.askApproval}>
                <Textarea onChange={event => updateOptionValue('comments', event.target.value)} defaultValue={parameters.comments} />
            </InputWithLabel>
            <LabeledCheckbox
                checked={parameters.notify}
                onChange={() => updateOptionValue('notify', !parameters.notify)}
                label="Receive notifications"
            />
            <InputWithLabel label="Grouping">
                <Select
                    onValueChange={value => {
                        const grouping = value === UNDEFINED_GROUPING ? undefined : (value as CreateRuleGrouping);
                        updateOptionValue('grouping', grouping);
                    }}
                    defaultValue={parameters.grouping ?? UNDEFINED_GROUPING}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Grouping" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={UNDEFINED_GROUPING}>Undefined</SelectItem>
                            <SelectItem value={CreateRuleGrouping.ALL}>All</SelectItem>
                            <SelectItem value={CreateRuleGrouping.DATASET}>Dataset</SelectItem>
                            <SelectItem value={CreateRuleGrouping.NONE}>None</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </InputWithLabel>
            <LabeledCheckbox
                checked={parameters.asynchronous}
                onChange={() => updateOptionValue('asynchronous', !parameters.asynchronous)}
                label="Asynchronous"
            />

            {/* Error handling */}
            {errors.copiesInvalid && (
                <WarningField>
                    <span>
                        Invalid value for <b>copies</b>. It should range from 1 to the number of chosen RSEs.
                    </span>
                </WarningField>
            )}

            {!errors.copiesInvalid && errors.tooManyCopies && (
                <WarningField>
                    <span>
                        There are less than <b>{parameters.copies}</b> chosen RSEs with enough quota left. Please change the number of <b>copies</b>{' '}
                        or mark the rule as needing approval.
                    </span>
                </WarningField>
            )}

            {errors.lifetimeInvalid && (
                <WarningField>
                    <span>
                        Invalid value for <b>lifetime</b>. It should be greater than 1 or not specified.
                    </span>
                </WarningField>
            )}

            {errors.commentsEmpty && (
                <WarningField>
                    <span>
                        A <b>comment</b> should be specified if there is a need for rule approval.
                    </span>
                </WarningField>
            )}

            {errors.groupingInvalid && (
                <WarningField>
                    <span>
                        The value of <b>grouping</b> is invalid.
                    </span>
                </WarningField>
            )}
        </div>
    );
};
