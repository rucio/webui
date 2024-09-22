import { CreateRuleGrouping, CreateRuleOptions, CreateRuleParameters } from '@/lib/infrastructure/data/view-model/rule';
import { cn } from '@/component-library/utils';
import React from 'react';
import { Input, Textarea } from '@/component-library/atoms/form/input';
import { LabeledCheckbox } from '@/component-library/features/form/LabeledCheckbox';
import { DIDType } from '@/lib/core/entity/rucio';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';

interface FieldWithLabelProps {
    label: string;
    children: React.ReactNode;
    className?: string;
}

const InputWithLabel: React.FC<FieldWithLabelProps> = ({ label, children, className }) => {
    return (
        <div className={cn('space-y-1', className)}>
            <label className="text-neutral-900 dark:text-neutral-100">{label}</label>
            {children}
        </div>
    );
};

type CreateRuleStageOptionsProps = {
    parameters: CreateRuleParameters;
    updateOptionValue: (key: keyof CreateRuleOptions, value: any) => void;
};

export const CreateRuleStageOptions = ({ parameters, updateOptionValue }: CreateRuleStageOptionsProps) => {
    return (
        <div className="flex flex-col space-y-5 w-full grow">
            <InputWithLabel label="Copies">
                <Input
                    onChange={event => updateOptionValue('copies', event.target.value)}
                    type="number"
                    min="1"
                    max={parameters.dids.length}
                    defaultValue={parameters.copies}
                />
            </InputWithLabel>
            <InputWithLabel label="Lifetime (days)">
                <Input
                    onChange={event => updateOptionValue('daysLifetime', event.target.value)}
                    type="number"
                    min="1"
                    defaultValue={parameters.daysLifetime}
                />
            </InputWithLabel>
            <InputWithLabel label="Comments">
                <Textarea onChange={event => updateOptionValue('comments', event.target.value)} defaultValue={parameters.comments} />
            </InputWithLabel>
            <LabeledCheckbox
                checked={parameters.notify}
                onChange={() => updateOptionValue('notify', !parameters.notify)}
                label="Receive notifications"
            />
            <InputWithLabel label="Grouping">
                <Select onValueChange={value => updateOptionValue('grouping', value as CreateRuleGrouping)} defaultValue={parameters.grouping}>
                    <SelectTrigger>
                        <SelectValue placeholder="Grouping" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
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
        </div>
    );
};
