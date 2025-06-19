import React, { useEffect, useState } from 'react';
import {
    CreateRuleGrouping,
    CreateRuleOptions,
    CreateRuleParameters,
    CreateRuleStorage,
    getEmptyCreateRuleParameters,
} from '@/lib/infrastructure/data/view-model/rule';
import { Heading } from '@/component-library/atoms/misc/Heading';
import Timeline from '@/component-library/features/Timeline';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { Button } from '@/component-library/atoms/form/button';
import { CreateRuleStageData } from '@/component-library/pages/Rule/create/stage-dids/CreateRuleStageData';
import { CreateRuleStageStorage } from '@/component-library/pages/Rule/create/stage-rses/CreateRuleStageStorage';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import {
    CreateRuleOptionsErrors,
    CreateRuleStageOptions,
    getEmptyOptionsErrors,
} from '@/component-library/pages/Rule/create/stage-options/CreateRuleStageOptions';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { CreateRuleStageSummary } from '@/component-library/pages/Rule/create/stage-summary/CreateRuleStageSummary';
import { CreateRuleStageSubmission } from '@/component-library/pages/Rule/create/stage-submission/CreateRuleStageSubmission';

const PreviousButton = ({ activeIndex, setActiveIndex }: { activeIndex: number; setActiveIndex: React.Dispatch<React.SetStateAction<number>> }) => {
    const disabled = activeIndex === 0;

    return (
        <Button variant="neutral" className="w-full sm:w-48 justify-between" disabled={disabled} onClick={() => setActiveIndex(prev => prev - 1)}>
            <HiArrowLeft />
            <span>Previous</span>
        </Button>
    );
};

const NextButton = ({
    activeIndex,
    setActiveIndex,
    stepsLength,
    isStepIncomplete,
}: {
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    stepsLength: number;
    isStepIncomplete: boolean;
}) => {
    const isSubmit = activeIndex === stepsLength - 2;
    const disabled = activeIndex === stepsLength - 1 || isStepIncomplete;

    return (
        <Button
            variant={isSubmit ? 'success' : 'neutral'}
            className="w-full sm:w-48 ml-auto justify-between"
            disabled={disabled}
            onClick={() => setActiveIndex(prev => prev + 1)}
        >
            <span>{isSubmit ? 'Submit' : 'Next'}</span>
            <HiArrowRight />
        </Button>
    );
};

interface CreateRuleProps {
    getSavedParameters: () => CreateRuleParameters | undefined;
    getSavedIndex: () => number | undefined;
    setSavedParameters: (parameters: CreateRuleParameters) => void;
    setSavedIndex: (activeIndex: number) => void;
    removeSavedParameters: () => void;
    removeSavedIndex: () => void;
}

export const CreateRule = (props: CreateRuleProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [parameters, setParameters] = useState<CreateRuleParameters>(getEmptyCreateRuleParameters());
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [optionsErrors, setOptionsErrors] = useState<CreateRuleOptionsErrors>(getEmptyOptionsErrors());

    const checkOptionsErrors = () => {
        const totalDataSize = parameters.dids.reduce((accumulator, current) => accumulator + current.bytes, 0);

        const newOptionErrors = getEmptyOptionsErrors();
        const { copies, daysLifetime, grouping, comments } = parameters;

        newOptionErrors.copiesInvalid = isNaN(copies) || copies < 1 || copies > parameters.rses.length;
        newOptionErrors.tooManyCopies =
            !parameters.askApproval &&
            parameters.rses.filter(rse => {
                if (rse.bytes_remaining >= totalDataSize) return true;
                // if the bytes_limit is -1, it means there is no limit (infinite quota)
                if (rse.bytes_limit === -1 && rse.has_quota) return true;
                return false;
            }).length < copies;

        newOptionErrors.lifetimeInvalid = daysLifetime !== undefined && (isNaN(daysLifetime) || daysLifetime < 1);

        newOptionErrors.commentsEmpty = parameters.askApproval && !comments;
        newOptionErrors.groupingInvalid =
            grouping !== undefined &&
            grouping !== CreateRuleGrouping.DATASET &&
            grouping !== CreateRuleGrouping.ALL &&
            grouping !== CreateRuleGrouping.NONE;

        newOptionErrors.sampleCountInvalid =
            parameters.sample && (!parameters.sampleFileCount || isNaN(parameters.sampleFileCount) || parameters.sampleFileCount < 1);

        setOptionsErrors(newOptionErrors);
    };

    useEffect(() => {
        const savedParameters = props.getSavedParameters();
        if (savedParameters) setParameters(savedParameters);

        const savedIndex = props.getSavedIndex();
        // TODO: check for range
        if (savedIndex) setActiveIndex(savedIndex);

        setIsLoading(false);
    }, []);

    // Effects to sync parameters and activeIndex with localStorage
    useEffect(() => {
        if (isLoading) return;
        props.setSavedParameters(parameters);
        checkOptionsErrors();
    }, [parameters]);
    useEffect(() => {
        // Don't save submission
        if (isLoading || activeIndex === 4) return;
        props.setSavedIndex(activeIndex);
    }, [activeIndex]);

    // Utility to partially update parameters
    const updateParameters = (newParams: Partial<CreateRuleParameters>) => {
        setParameters(prevState => ({ ...prevState, ...newParams }));
    };

    const updateStorage = (storage: CreateRuleStorage) => updateParameters(storage);
    const updateNeedsApproval = (needsApproval: boolean) => updateParameters({ needsApproval });
    const updateAskApproval = (askApproval: boolean) => updateParameters({ askApproval });
    const updateOptionValue = (key: keyof CreateRuleOptions, value: any) => {
        setParameters(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const addDID = (did: ListDIDsViewModel) => {
        setParameters(prevState => {
            const didExists = prevState.dids.some(element => element.scope === did.scope && element.name === did.name);
            if (didExists) return prevState;

            return { ...prevState, dids: [...prevState.dids, did] };
        });
    };

    const removeDID = (did: ListDIDsViewModel) => {
        setParameters(prevState => ({
            ...prevState,
            dids: prevState.dids.filter(element => element.scope !== did.scope || element.name !== did.name),
        }));
    };

    const isStepIncomplete = (): boolean => {
        let isIncomplete = false;

        if (activeIndex >= 0) {
            isIncomplete = isIncomplete || parameters.dids.length === 0;
        }
        if (activeIndex >= 1) {
            isIncomplete = isIncomplete || parameters.rses.length === 0 || (parameters.needsApproval && !parameters.askApproval);
        }
        if (activeIndex >= 2) {
            isIncomplete = isIncomplete || Object.values(optionsErrors).some(error => error);
        }

        return isIncomplete;
    };

    const steps = ['DIDs', 'RSEs', 'Options', 'Summary', 'Results'];

    if (isLoading) {
        return (
            <div className="flex w-full grow items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const getPaginationPanel = () => {
        return (
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                <PreviousButton activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                <NextButton
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    stepsLength={steps.length}
                    isStepIncomplete={isStepIncomplete()}
                />
            </div>
        );
    };

    // Keep stage DIDs rendered, as it may contain large streamed data
    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="New Rule" />
            <Timeline steps={steps} activeIndex={activeIndex} onSwitch={activeIndex !== 4 ? setActiveIndex : undefined} />
            <div>
                <CreateRuleStageData visible={activeIndex === 0} parameters={parameters} addDID={addDID} removeDID={removeDID} />
                {activeIndex === 1 && (
                    <CreateRuleStageStorage
                        parameters={parameters}
                        updateStorage={updateStorage}
                        updateNeedsApproval={updateNeedsApproval}
                        updateAskApproval={updateAskApproval}
                    />
                )}
                {activeIndex === 2 && <CreateRuleStageOptions parameters={parameters} updateOptionValue={updateOptionValue} errors={optionsErrors} />}
                {activeIndex === 3 && <CreateRuleStageSummary parameters={parameters} />}
            </div>
            {activeIndex === 4 && (
                <CreateRuleStageSubmission
                    parameters={parameters}
                    removeSaved={() => {
                        props.removeSavedIndex();
                        props.removeSavedParameters();
                    }}
                />
            )}
            {activeIndex !== 4 && getPaginationPanel()}
        </div>
    );
};
