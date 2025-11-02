import { CreateRuleGrouping, CreateRuleOptions, CreateRuleParameters } from '@/lib/infrastructure/data/view-model/rule';
import { cn } from '@/component-library/utils';
import React, { ChangeEvent, FormEvent, useRef } from 'react';
import { Input, Textarea } from '@/component-library/atoms/form/input';
import { LabeledCheckbox } from '@/component-library/features/form/LabeledCheckbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/component-library/atoms/misc/Collapsible';

interface FieldWithLabelProps {
    label: string;
    children: React.ReactNode;
    className?: string;
    required?: boolean;
    helpText?: string;
    error?: boolean;
    errorMessage?: string;
}

const InputWithLabel: React.FC<FieldWithLabelProps> = ({ label, children, className, required, helpText, error, errorMessage }) => {
    return (
        <div className={cn('space-y-2', className)}>
            <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {label}
                {required && <span className="text-base-error-600 dark:text-base-error-500 ml-1">*</span>}
            </label>
            {helpText && <p className="text-sm text-neutral-600 dark:text-neutral-400 -mt-1">{helpText}</p>}
            {children}
            {error && errorMessage && (
                <p className="text-sm text-base-error-600 dark:text-base-error-500 flex items-start gap-1">
                    <span className="font-medium">Error:</span>
                    <span>{errorMessage}</span>
                </p>
            )}
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

const LifetimeInput = ({
    parameters,
    updateOptionValue,
    errors,
}: {
    parameters: CreateRuleParameters;
    updateOptionValue: (key: keyof CreateRuleOptions, value: any) => void;
    errors: CreateRuleOptionsErrors;
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
        <Collapsible className="space-y-0">
            <CollapsibleTrigger variant="outline" className="font-medium text-neutral-900 dark:text-neutral-100">
                Lifetime
            </CollapsibleTrigger>
            <CollapsibleContent variant="outline">
                <div className="space-y-4">
                    <InputWithLabel
                        label="Days"
                        helpText="Number of days before the rule expires (leave empty for no expiration)"
                        error={errors.lifetimeInvalid}
                        errorMessage="Lifetime should be greater than 1 or not specified"
                    >
                        <Input
                            onInput={onLifetimeInput}
                            type="number"
                            min="1"
                            max="1000"
                            defaultValue={getDefaultLifetime()}
                            ref={lifetimeInputRef}
                            error={errors.lifetimeInvalid}
                        />
                    </InputWithLabel>

                    <InputWithLabel label="Expires on" helpText="Alternatively, select a specific expiration date">
                        <Input type="date" value={getExpiryDate()} onInput={onDateInput} />
                    </InputWithLabel>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

const AdvancedInput = ({
    parameters,
    updateOptionValue,
    errors,
}: {
    parameters: CreateRuleParameters;
    updateOptionValue: (key: keyof CreateRuleOptions, value: any) => void;
    errors: CreateRuleOptionsErrors;
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
        <Collapsible className="space-y-0">
            <CollapsibleTrigger variant="outline" className="font-medium text-neutral-900 dark:text-neutral-100">
                Advanced Options
            </CollapsibleTrigger>
            <CollapsibleContent variant="outline">
                <div className="space-y-4">
                    <InputWithLabel
                        label="Grouping"
                        helpText="Defines how files in datasets/containers are grouped for replication"
                        error={errors.groupingInvalid}
                        errorMessage="The value of grouping is invalid"
                    >
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
                    <div className="space-y-3">
                        <LabeledCheckbox
                            checked={parameters.asynchronous}
                            onChange={() => updateOptionValue('asynchronous', !parameters.asynchronous)}
                            label="Asynchronous"
                        />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 ml-7">Create rule asynchronously in the background</p>
                    </div>
                    <div className="space-y-3">
                        <LabeledCheckbox checked={parameters.sample} onChange={() => updateOptionValue('sample', !parameters.sample)} label="Create a sample" />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 ml-7">Create a rule for a random sample of files</p>
                    </div>
                    {parameters.sample && (
                        <InputWithLabel
                            label="Number of files"
                            helpText="Specify how many files to include in the sample"
                            error={errors.sampleCountInvalid}
                            errorMessage="Number of files should be greater than 1 or not specified"
                        >
                            <Input type="number" min="1" onInput={onFileCountInput} defaultValue={getDefaultFileCount()} error={errors.sampleCountInvalid} />
                        </InputWithLabel>
                    )}
                </div>
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
        <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
            <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
                {/* Basic Configuration Section */}
                <div className="space-y-4 pb-6">
                    <InputWithLabel
                        label="Copies"
                        required
                        helpText={`Number of replicas to create (max: ${parameters.rses.length} based on selected RSEs)`}
                        error={errors.copiesInvalid}
                        errorMessage={`Copies should range from 1 to ${parameters.rses.length} (number of chosen RSEs)`}
                    >
                        <Input onChange={onCopiesInput} type="number" min="1" max={parameters.rses.length} defaultValue={defaultCopies} error={errors.copiesInvalid} />
                    </InputWithLabel>

                    {/* Show contextual warning for quota issues */}
                    {!errors.copiesInvalid && errors.tooManyCopies && (
                        <WarningField>
                            <span>
                                There are less than <b>{parameters.copies}</b> chosen RSEs with enough quota left. Please change the number of <b>copies</b> or
                                mark the rule as needing approval in Step 2.
                            </span>
                        </WarningField>
                    )}
                </div>

                {/* Lifetime Configuration */}
                <div className="py-6">
                    <LifetimeInput parameters={parameters} updateOptionValue={updateOptionValue} errors={errors} />
                </div>

                {/* Comments Section */}
                <div className="pt-6 pb-6">
                    <InputWithLabel
                        label="Comments"
                        required={parameters.askApproval}
                        helpText={parameters.askApproval ? 'Required when asking for approval' : 'Optional comments about this rule'}
                        error={errors.commentsEmpty}
                        errorMessage="A comment should be specified when asking for approval"
                    >
                        <Textarea onChange={event => updateOptionValue('comments', event.target.value)} defaultValue={parameters.comments} error={errors.commentsEmpty} />
                    </InputWithLabel>
                </div>

                {/* Notifications */}
                <div className="space-y-3 pt-6 pb-6">
                    <LabeledCheckbox checked={parameters.notify} onChange={() => updateOptionValue('notify', !parameters.notify)} label="Receive notifications" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 ml-7">Get notified when the rule state changes</p>
                </div>

                {/* Advanced Configuration */}
                <div className="pt-6">
                    <AdvancedInput parameters={parameters} updateOptionValue={updateOptionValue} errors={errors} />
                </div>
            </div>
        </div>
    );
};
