import {useEffect, useState} from 'react';
import {
    CreateRuleOptions,
    CreateRuleParameters,
    CreateRuleStorage,
    getEmptyCreateRuleParameters
} from '@/lib/infrastructure/data/view-model/rule';
import {Heading} from '@/component-library/atoms/misc/Heading';
import Timeline from '@/component-library/features/Timeline';
import {HiArrowLeft, HiArrowRight} from 'react-icons/hi';
import {Button} from '@/component-library/atoms/form/button';
import {CreateRuleStageData} from '@/component-library/pages/Rule/create/stage-dids/CreateRuleStageData';
import {DIDLongViewModel} from '@/lib/infrastructure/data/view-model/did';

const PARAMS_KEY = 'create_rule_parameters';
const ACTIVE_KEY = 'create_rule_active';

export const CreateRule = () => {
    const initialParametersString = localStorage.getItem(PARAMS_KEY);
    const [parameters, setParameters] = useState<CreateRuleParameters>(
        initialParametersString ? JSON.parse(initialParametersString) : getEmptyCreateRuleParameters(),
    );

    const addDID = (did: DIDLongViewModel) => {
        setParameters(prevState => {
            if (prevState.dids.some(element => element.scope === did.scope && element.name === did.name)) {
                return prevState;
            }
            return {
                ...prevState,
                dids: [...prevState.dids, did],
            };
        });
    };

    const removeDID = (did: DIDLongViewModel) => {
        setParameters(prevState => ({
            ...prevState,
            dids: prevState.dids.filter(element => element.scope !== did.scope || element.name !== did.name),
        }));
    };

    const updateStorage = (storage: CreateRuleStorage) => {
        setParameters(prevState => ({
            ...prevState,
            ...storage,
        }));
    };

    const updateOptions = (options: CreateRuleOptions) => {
        setParameters(prevState => ({
            ...prevState,
            ...options,
        }));
    };

    useEffect(() => {
        localStorage.setItem(PARAMS_KEY, JSON.stringify(parameters));
    }, [parameters]);

    const steps = ['DIDs', 'RSEs', 'Options', 'Summary', 'Results'];

    const initialActiveString = localStorage.getItem(ACTIVE_KEY);
    const [activeIndex, setActiveIndex] = useState<number>(initialActiveString ? parseInt(initialActiveString) : 0);

    useEffect(() => {
        localStorage.setItem(ACTIVE_KEY, activeIndex.toString());
    }, [activeIndex]);

    const getPreviousButton = () => {
        const disabled = activeIndex === 0;
        return <Button className="w-full sm:w-48 justify-between" disabled={disabled}
                       onClick={() => setActiveIndex(prevState => prevState - 1)}>
            <HiArrowLeft/>
            <span>Previous</span>
        </Button>
    }

    // TODO: refactor for being reused
    const isStepIncomplete = (): boolean => {
        if (activeIndex === 0) {
            return parameters.dids.length === 0;
        } else if (activeIndex === 1) {
            // TODO: or there's not enough quota
            return parameters.rses.length === 0;
        }
        return true;
    };

    const getNextButton = () => {
        const disabled = activeIndex === steps.length - 1 || isStepIncomplete();
        return <Button className="w-full sm:w-48 ml-auto justify-between" disabled={disabled} onClick={() => setActiveIndex(prevState => prevState + 1)}>
            <span>Next</span>
            <HiArrowRight/>
        </Button>
    }

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="New Rule"/>
            <Timeline steps={steps} activeIndex={activeIndex} onSwitch={setActiveIndex}/>
            <div className="flex grow">
                <CreateRuleStageData parameters={parameters} addDID={addDID} removeDID={removeDID}
                                     visible={activeIndex === 0}/>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                {getPreviousButton()}
                {getNextButton()}
            </div>
        </div>
    );
};
