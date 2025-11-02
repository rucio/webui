import { CreateRuleParameters, CreateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import Link from 'next/link';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { motion, useReducedMotion } from 'motion/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { HiCheck } from 'react-icons/hi';

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
            sample: parameters.sample,
            sample_file_count: parameters.sampleFileCount,
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
        if (data) {
            removeSaved();
        }
    }, [data]);

    const AnimatedRucioLogo = () => {
        const { resolvedTheme } = useTheme();
        const [mounted, setMounted] = useState(false);
        const shouldReduceMotion = useReducedMotion();

        useEffect(() => {
            setMounted(true);
        }, []);

        if (!mounted) {
            return <div className="w-32 h-32" />;
        }

        const logoPath = resolvedTheme === 'dark' ? '/logo_dark.svg' : '/logo_light.svg';

        if (shouldReduceMotion) {
            return (
                <div className="w-32 h-32 flex items-center justify-center">
                    <Image src={logoPath} alt="Rucio Logo" width={128} height={128} priority suppressHydrationWarning />
                </div>
            );
        }

        return (
            <motion.div
                className="relative w-32 h-32"
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    duration: 0.8,
                }}
            >
                {/* Pulsing ring around logo */}
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-brand-500"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.2, 1], opacity: [0, 1, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                />

                {/* Success checkmark background */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-brand-500/10 dark:bg-brand-400/10 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <motion.div
                        className="absolute top-2 right-2 bg-brand-600 dark:bg-brand-500 rounded-full p-2"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 12 }}
                    >
                        <HiCheck className="w-5 h-5 text-white" />
                    </motion.div>
                </motion.div>

                {/* Logo */}
                <motion.div
                    className="relative w-full h-full flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <Image src={logoPath} alt="Rucio Logo" width={96} height={96} priority suppressHydrationWarning />
                </motion.div>
            </motion.div>
        );
    };

    const getDataComponent = () => {
        if (!data) return;

        return (
            <motion.div
                className="flex flex-col items-center space-y-6 max-w-2xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <AnimatedRucioLogo />

                <motion.div
                    className="text-center space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                >
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Rule Created Successfully!</h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Your rule{data.rule_ids.length > 1 ? 's have' : ' has'} been created and {data.rule_ids.length > 1 ? 'are' : 'is'} now active.
                    </p>
                </motion.div>

                <motion.div
                    className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.4 }}
                >
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <HiCheck className="w-5 h-5 text-brand-600 dark:text-brand-500" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                Rule ID{data.rule_ids.length > 1 ? 's' : ''}
                            </h3>
                        </div>
                        <ul className="space-y-2">
                            {data.rule_ids.map((id, index) => (
                                <motion.li
                                    key={id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                                >
                                    <Link
                                        href={`/rule/page/${id}`}
                                        className="flex items-center space-x-2 p-3 rounded-md bg-neutral-100 dark:bg-neutral-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors duration-200 border border-transparent hover:border-brand-500 dark:hover:border-brand-400"
                                    >
                                        <span className="text-neutral-900 dark:text-neutral-100 font-mono text-sm">{id}</span>
                                        <span className="ml-auto text-brand-600 dark:text-brand-400 text-sm font-medium">View Details →</span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    className="text-center text-neutral-600 dark:text-neutral-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.4 }}
                >
                    <span>
                        You can also view all your rules in the{' '}
                        <Link href="/rule/list" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                            rules list
                        </Link>
                    </span>
                </motion.div>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col w-full grow justify-center items-center p-6">
            {isFetching && <span className="text-neutral-900 dark:text-neutral-100">Creating...</span>}
            {error && (
                <Alert
                    variant="error"
                    message={`Failed to create rule: ${error.toString()}. Please review the previous steps and try again.`}
                    onClose={() => {
                        location.reload();
                    }}
                />
            )}
            {data && getDataComponent()}
        </div>
    );
};
