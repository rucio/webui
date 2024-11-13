'use client';
import { CreateRule } from '@/component-library/pages/Rule/create/CreateRule';
import { CreateRuleParameters } from '@/lib/infrastructure/data/view-model/rule';
import { useEffect } from 'react';

const PARAMS_KEY = 'create_rule_parameters';
const ACTIVE_KEY = 'create_rule_active';

export default function Page() {
    useEffect(() => {
        document.title = 'Create Rule - Rucio';
    }, []);

    const getSavedParameters = () => {
        const initialParametersString = localStorage.getItem(PARAMS_KEY);
        // TODO: check with zod
        if (initialParametersString) {
            try {
                return JSON.parse(initialParametersString);
            } catch (e) {
                return undefined;
            }
        }
        return undefined;
    };

    const getSavedIndex = () => {
        const initialActiveString = localStorage.getItem(ACTIVE_KEY);

        if (initialActiveString) {
            const numberValue = parseInt(initialActiveString);
            return isNaN(numberValue) ? undefined : numberValue;
        }
    };

    const setSavedParameters = (parameters: CreateRuleParameters) => {
        localStorage.setItem(PARAMS_KEY, JSON.stringify(parameters));
    };

    const setSavedIndex = (activeIndex: number) => {
        localStorage.setItem(ACTIVE_KEY, activeIndex.toString());
    };

    const removeSavedParameters = () => {
        localStorage.removeItem(PARAMS_KEY);
    };

    const removeSavedIndex = () => {
        localStorage.removeItem(ACTIVE_KEY);
    };

    return (
        <CreateRule
            getSavedIndex={getSavedIndex}
            getSavedParameters={getSavedParameters}
            setSavedIndex={setSavedIndex}
            setSavedParameters={setSavedParameters}
            removeSavedParameters={removeSavedParameters}
            removeSavedIndex={removeSavedIndex}
        />
    );
}
