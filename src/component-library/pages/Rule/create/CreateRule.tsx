import React, { useEffect, useState } from 'react';
import { CreateRuleOptions, CreateRuleParameters, CreateRuleStorage, getEmptyCreateRuleParameters } from '@/lib/infrastructure/data/view-model/rule';
import { Heading } from '@/component-library/atoms/misc/Heading';
import Timeline from '@/component-library/features/Timeline';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { Button } from '@/component-library/atoms/form/button';
import { CreateRuleStageData } from '@/component-library/pages/Rule/create/stage-dids/CreateRuleStageData';
import { DIDLongViewModel } from '@/lib/infrastructure/data/view-model/did';
import { CreateRuleStageStorage } from '@/component-library/pages/Rule/create/stage-rses/CreateRuleStageStorage';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { CreateRuleStageOptions } from '@/component-library/pages/Rule/create/stage-options/CreateRuleStageOptions';

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
    const disabled = activeIndex === stepsLength - 1 || isStepIncomplete;

    return (
        <Button
            variant="neutral"
            className="w-full sm:w-48 ml-auto justify-between"
            disabled={disabled}
            onClick={() => setActiveIndex(prev => prev + 1)}
        >
            <span>Next</span>
            <HiArrowRight />
        </Button>
    );
};

const PARAMS_KEY = 'create_rule_parameters';
const ACTIVE_KEY = 'create_rule_active';

export const CreateRule = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [parameters, setParameters] = useState<CreateRuleParameters>(getEmptyCreateRuleParameters());
    const [activeIndex, setActiveIndex] = useState<number>(0);

    useEffect(() => {
        const initialParametersString = localStorage.getItem(PARAMS_KEY);
        const initialActiveString = localStorage.getItem(ACTIVE_KEY);

        if (initialParametersString) {
            setParameters(JSON.parse(initialParametersString));
        }

        if (initialActiveString) {
            setActiveIndex(parseInt(initialActiveString));
        }

        setIsLoading(false);
    }, []);

    // Effects to sync parameters and activeIndex with localStorage
    useEffect(() => {
        if (isLoading) return;
        localStorage.setItem(PARAMS_KEY, JSON.stringify(parameters));
    }, [parameters]);
    useEffect(() => {
        if (isLoading) return;
        localStorage.setItem(ACTIVE_KEY, activeIndex.toString());
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

    const addDID = (did: DIDLongViewModel) => {
        setParameters(prevState => {
            const didExists = prevState.dids.some(element => element.scope === did.scope && element.name === did.name);
            if (didExists) return prevState;

            return { ...prevState, dids: [...prevState.dids, did] };
        });
    };

    const removeDID = (did: DIDLongViewModel) => {
        setParameters(prevState => ({
            ...prevState,
            dids: prevState.dids.filter(element => element.scope !== did.scope || element.name !== did.name),
        }));
    };

    // TODO: refactor for being reused
    const isStepIncomplete = (): boolean => {
        if (activeIndex === 0) {
            return parameters.dids.length === 0;
        } else if (activeIndex === 1) {
            return parameters.rses.length === 0 || (parameters.needsApproval && !parameters.askApproval);
        }
        return true;
    };

    const steps = ['DIDs', 'RSEs', 'Options', 'Summary', 'Results'];

    if (isLoading) {
        return (
            <div className="flex w-full grow items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Keep stage DIDs rendered, as it may contain large streamed data
    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="New Rule" />
            <Timeline steps={steps} activeIndex={activeIndex} onSwitch={setActiveIndex} />
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
                {activeIndex === 2 && <CreateRuleStageOptions parameters={parameters} updateOptionValue={updateOptionValue} />}
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                <PreviousButton activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                <NextButton
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    stepsLength={steps.length}
                    isStepIncomplete={isStepIncomplete()}
                />
            </div>
        </div>
    );
};
