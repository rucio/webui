import { CreateRuleParameters, CreateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import Link from 'next/link';

type CreateRuleStageSubmissionProps = {
    parameters: CreateRuleParameters;
    removeSaved: () => void;
};

const OR_SYMBOL = '|';

export const CreateRuleStageSubmission = ({ parameters, removeSaved }: CreateRuleStageSubmissionProps) => {
    const queryCreateRule = async () => {
        const rseExpression = parameters.rses.map(rse => rse.rse).join(OR_SYMBOL);
        const body = JSON.stringify({
            dids: parameters.dids.map(did => ({
                scope: did.scope,
                name: did.name,
            })),
            copies: parameters.copies,
            rse_expression: rseExpression,
            grouping: parameters.grouping?.toUpperCase(),
            lifetime_days: parameters.daysLifetime,
            notify: parameters.notify,
            comments: parameters.comments,
            ask_approval: parameters.askApproval,
            asynchronous: parameters.asynchronous,
        });
        const url = '/api/feature/create-rule';

        const res = await fetch(url, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let json;

        try {
            json = await res.json();
        } catch (e) {
            throw new Error(res.statusText);
        }

        if (json.error) {
            throw new Error(json.error);
        }

        if (json.status !== 'success' || json.rule_ids.length === 0) {
            throw new Error(json.message);
        }

        return json;
    };

    const createQueryKey = ['create_rule'];
    const { data, error, isFetching } = useQuery<CreateRuleViewModel, string>({
        queryKey: createQueryKey,
        queryFn: queryCreateRule,
        enabled: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false,
    });

    const { toast } = useToast();

    useEffect(() => {
        if (error) {
            toast({
                variant: 'error',
                title: 'Fatal error',
                description: error.toString(),
            });
        }
    }, [error]);

    const getErrorComponent = () => {
        const button = (
            <span
                className="cursor-pointer hover:text-brand-500"
                onClick={() => {
                    location.reload();
                }}
            >
                <b>review the previous steps</b>
            </span>
        );
        return <span className="text-neutral-900 dark:text-neutral-100">Could not create the rule. Please {button} and try again.</span>;
    };

    useEffect(() => {
        if (data) {
            removeSaved();
        }
    }, [data]);

    const getDataComponent = () => {
        const button = (
            <Link href="/rule/list" className="cursor-pointer hover:text-brand-500">
                <b>rules list</b>
            </Link>
        );
        return <span className="text-neutral-900 dark:text-neutral-100">Successfully requested the rule. Proceed to the {button} to view it.</span>;
    };

    return (
        <div className="flex flex-col w-full grow justify-center items-center">
            {isFetching && <span>Creating...</span>}
            {error && getErrorComponent()}
            {data && getDataComponent()}
        </div>
    );
};
