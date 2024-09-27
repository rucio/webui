import { CreateRuleGrouping, CreateRuleOptions, CreateRuleParameters } from '@/lib/infrastructure/data/view-model/rule';
import { cn } from '@/component-library/utils';
import React, { ChangeEvent, FormEvent, useRef } from 'react';
import { Input, Textarea } from '@/component-library/atoms/form/input';
import { LabeledCheckbox } from '@/component-library/features/form/LabeledCheckbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/component-library/atoms/misc/collapsible';
import { HiChevronUpDown } from 'react-icons/hi2';

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
    commentsEmpty: boolean;
    groupingInvalid: boolean;
    sampleCountInvalid: boolean;
};

export const getEmptyOptionsErrors = (): CreateRuleOptionsErrors => {
    return {
        commentsEmpty: false,
        copiesInvalid: false,
        groupingInvalid: false,
        lifetimeInvalid: false,
        tooManyCopies: false,
        sampleCountInvalid: false,
    };
};

interface OptionsCollapsibleTriggerProps {
    label: string;
    className?: string;
}

const OptionsCollapsibleTrigger: React.FC<OptionsCollapsibleTriggerProps> = ({ label, className }) => {
    return (
        <CollapsibleTrigger
            className={cn(
                'flex w-full items-center justify-between space-x-2',
                'py-2 px-3',
                'text-neutral-900 dark:text-neutral-100',
                'rounded-md border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                className,
            )}
        >
            <span>{label}</span>
            <HiChevronUpDown className="h-6 w-6" />
        </CollapsibleTrigger>
    );
};

const collapsibleContentStyle = 'pt-3 space-y-5';

const LifetimeInput = ({
    parameters,
    updateOptionValue,
}: {
    parameters: CreateRuleParameters;
    updateOptionValue: (key: keyof CreateRuleOptions, value: any) => void;
}) => {
    const lifetimeInputRef = useRef<HTMLInputElement>(null);

    const onLifetimeInput = (event: FormEvent<HTMLInputElement>) => {
        let value;
        if (event.currentTarget.validity.valid) {
            value = event.currentTarget.value === '' ? undefined : parseInt(event.currentTarget.value, 10);
        } else {
            value = NaN;
        }
        updateOptionValue('daysLifetime', value);
    };

    const onDateInput = (event: FormEvent<HTMLInputElement>) => {
        const selectedDate = new Date(event.currentTarget.value);
        const currentDate = new Date();
        const differenceInDays = Math.ceil((selectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        updateOptionValue('daysLifetime', differenceInDays);
        if (lifetimeInputRef.current) {
            lifetimeInputRef.current.value = differenceInDays.toString();
        }
    };

    const getExpiryDate = () => {
        const currentDate = new Date();
        if (parameters.daysLifetime) {
            const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + parameters.daysLifetime));
            // Returns date in yyyy-mm-dd format
            return expiryDate.toISOString().split('T')[0];
        }
        return '';
    };

    const getDefaultLifetime = () => {
        if (parameters.daysLifetime === undefined) return '';
        if (isNaN(parameters.daysLifetime)) return -1;
        return parameters.daysLifetime;
    };

    return (
        <Collapsible>
            <OptionsCollapsibleTrigger label="Lifetime" />
            <CollapsibleContent className={collapsibleContentStyle}>
                <InputWithLabel label="Days">
                    <Input onInput={onLifetimeInput} type="number" min="1" max="1000" defaultValue={getDefaultLifetime()} ref={lifetimeInputRef} />
                </InputWithLabel>

                <InputWithLabel label="Expires on">
                    <Input type="date" value={getExpiryDate()} onInput={onDateInput} />
                </InputWithLabel>
            </CollapsibleContent>
        </Collapsible>
    );
};

const AdvancedInput = ({
    parameters,
    updateOptionValue,
}: {
    parameters: CreateRuleParameters;
    updateOptionValue: (key: keyof CreateRuleOptions, value: any) => void;
}) => {
    const onFileCountInput = (event: FormEvent<HTMLInputElement>) => {
        let value;
        if (event.currentTarget.validity.valid) {
            value = event.currentTarget.value === '' ? undefined : parseInt(event.currentTarget.value, 10);
        } else {
            value = NaN;
        }
        updateOptionValue('sampleFileCount', value);
    };

    const getDefaultFileCount = () => {
        if (parameters.sampleFileCount === undefined) return '';
        if (isNaN(parameters.sampleFileCount)) return -1;
        return parameters.sampleFileCount;
    };

    return (
        <Collapsible>
            <OptionsCollapsibleTrigger label="Advanced" />
            <CollapsibleContent className={collapsibleContentStyle}>
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
                <LabeledCheckbox
                    checked={parameters.sample}
                    onChange={() => updateOptionValue('sample', !parameters.sample)}
                    label="Create a sample"
                />
                {parameters.sample && (
                    <InputWithLabel label="Number of files">
                        <Input type="number" min="1" onInput={onFileCountInput} defaultValue={getDefaultFileCount()}/>
                    </InputWithLabel>
                )}
            </CollapsibleContent>
        </Collapsible>
    );
};

type CreateRuleStageOptionsProps = {
    parameters: CreateRuleParameters;
    updateOptionValue: (key: keyof CreateRuleOptions, value: any) => void;
    errors: CreateRuleOptionsErrors;
};

const UNDEFINED_GROUPING = 'undefined';

export const CreateRuleStageOptions = ({ parameters, updateOptionValue, errors }: CreateRuleStageOptionsProps) => {
    const onCopiesInput = (event: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        updateOptionValue('copies', value);
    };

    const defaultCopies = isNaN(parameters.copies) ? '' : parameters.copies;

    return (
        <div className="flex flex-col space-y-5 w-full grow">
            <InputWithLabel label="Copies" required>
                <Input onChange={onCopiesInput} type="number" min="1" max={parameters.rses.length} defaultValue={defaultCopies} />
            </InputWithLabel>

            <LifetimeInput parameters={parameters} updateOptionValue={updateOptionValue} />

            <InputWithLabel label="Comments" required={parameters.askApproval}>
                <Textarea onChange={event => updateOptionValue('comments', event.target.value)} defaultValue={parameters.comments} />
            </InputWithLabel>
            <LabeledCheckbox
                checked={parameters.notify}
                onChange={() => updateOptionValue('notify', !parameters.notify)}
                label="Receive notifications"
            />
            <AdvancedInput parameters={parameters} updateOptionValue={updateOptionValue} />

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

            {errors.sampleCountInvalid && (
                <WarningField>
                    <span>
                        Invalid value for <b>number of files</b>. It should be greater than 1 or not specified.
                    </span>
                </WarningField>
            )}
        </div>
    );
};
