import { twMerge } from 'tailwind-merge';
import { Button } from '../../../atoms/form/button';
import { AreaInput } from '../../../atoms/legacy/input/AreaInput/AreaInput';
import React, { useState, useEffect } from 'react';
import { HiQuestionMarkCircle } from 'react-icons/hi';
import { Collapsible } from '../../../atoms/legacy/helpers/Collapsible/Collapsible';

export const PageSubscriptionJSONEditor: React.FC<
    React.ComponentPropsWithoutRef<'div'> & {
        defaultString: string;
        submit: (json: string) => void;
        schemaDescription?: string;
    }
> = ({ defaultString, submit, schemaDescription, ...props }) => {
    const { className, ...otherprops } = props;
    const [json, setJson] = useState<string>(defaultString);
    useEffect(() => {
        setJson(defaultString);
    }, [defaultString]);
    const [jsonError, setJsonError] = useState<string | null>(''); // null means no error, "" means no error but not checked yet
    const [helpWanted, setHelpWanted] = useState<boolean>(false);
    const rowNum = (defaultString ?? '').split(/\n/).length;
    return (
        <div className={twMerge('flex flex-col space-y-1', className ?? '')}>
            <AreaInput
                content={json}
                rows={rowNum < 16 ? rowNum : 16}
                className=""
                onChange={e => {
                    setJson(e.target.value);
                    setJsonError('');
                }}
            />
            <div className="flex flex-row justify-between items-baseline">
                <div>
                    {jsonError === null ? (
                        <span
                            className={twMerge(
                                'w-fit px-2.5 py-0.5',
                                'bg-base-success-100 text-base-success-800 dark:bg-base-success-900 dark:text-base-success-300',
                            )}
                        >
                            JSON is valid
                        </span>
                    ) : (
                        <span
                            className={twMerge(
                                jsonError === '' ? 'hidden' : 'block',
                                'w-fit px-2.5 py-0.5 rounded',
                                'bg-base-error-100 text-base-error-800 dark:bg-base-error-900 dark:text-base-error-300',
                            )}
                        >
                            {jsonError}
                        </span>
                    )}
                </div>
                <div className="flex flex-row space-x-2">
                    <Button
                        size="icon"
                        aria-label="Show schema"
                        onClick={e => {
                            setHelpWanted(!helpWanted);
                        }}
                    >
                        <HiQuestionMarkCircle className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="error"
                        className="w-28"
                        onClick={e => {
                            setJson(defaultString);
                            setJsonError('');
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="neutral"
                        className="w-28"
                        onClick={e => {
                            try {
                                const parsed = JSON.parse(json);
                                const reformatted = JSON.stringify(parsed, null, 2);
                                if (reformatted === defaultString) {
                                    setJsonError('JSON unchanged');
                                } else {
                                    setJsonError(null);
                                }
                                setJson(reformatted);
                            } catch (SyntaxError) {
                                setJsonError('Syntax Error');
                            }
                        }}
                    >
                        Check
                    </Button>
                    <Button
                        variant="success"
                        type="submit"
                        disabled={jsonError !== null}
                        className="w-28"
                        onClick={e => {
                            submit(json);
                        }}
                    >
                        Commit
                    </Button>
                </div>
            </div>
            {schemaDescription && (
                <Collapsible showIf={helpWanted}>
                    <h4 className="text-neutral-800 dark:text-neutral-100 font-bold">Help</h4>
                    <div className="mt-2 p-4 bg-base-neutral-100 dark:bg-base-neutral-800 rounded">{schemaDescription}</div>
                </Collapsible>
            )}
        </div>
    );
};
