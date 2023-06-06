import { twMerge } from "tailwind-merge";
import { Button } from "../../Button/Button";
import { AreaInput } from "../../Input/AreaInput";
import { useState, useEffect } from "react";
import { Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value"


export const PageSubscriptionJSONEditor: React.FC<JSX.IntrinsicElements["div"] & {
    defaultString: string,
    submit: (json: string) => void,
    schema: Static<any>
}> = (
    {
        defaultString,
        submit,
        schema,
        ...props
    }
) => {
        const { className, ...otherprops } = props
        const [json, setJson] = useState<string>(defaultString)
        const [jsonError, setJsonError] = useState<string | null>("") // null means no error, "" means no error but not checked yet
        return (
            <div
                className={twMerge(
                    "flex flex-col space-y-1",
                    className ?? "",
                )}
            >
                <AreaInput
                    content={json}
                    rows={defaultString.split(/\n/).length}
                    className=""
                    onChange={(e) => {
                        setJson(e.target.value)
                        setJsonError("")
                    }}
                />
                <div className="flex flex-row justify-between items-baseline">
                    <div>
                        {
                            jsonError === null ?
                                <span
                                    className={twMerge(
                                        "w-fit px-2.5 py-0.5",
                                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    )}
                                >
                                    JSON is valid
                                </span> :
                                <span
                                    className={twMerge(
                                        jsonError === "" ? "hidden" : "block",
                                        "w-fit px-2.5 py-0.5 rounded",
                                        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    )}
                                >
                                    {jsonError}
                                </span>
                        }
                    </div>
                    <div className="flex flex-row space-x-2">
                        <Button
                            label="Reset"
                            type="reset"
                            className="w-28"
                            onClick={(e) => {
                                setJson(defaultString)
                                setJsonError("")
                            }}
                        />
                        <Button
                            label="Check"
                            type="button"
                            className="w-28"
                            onClick={(e) => {
                                try {
                                    const parsed = JSON.parse(json)
                                    if (Value.Check(schema, parsed)) {
                                        setJsonError(null)
                                    } else {
                                        setJsonError("JSON does not match schema")
                                    }
                                    const reformatted = JSON.stringify(parsed, null, 2)
                                    if (reformatted === defaultString) {
                                        setJsonError("JSON unchanged")
                                    }
                                    setJson(reformatted)
                                } catch (SyntaxError) {
                                    setJsonError("Syntax Error")
                                }
                            }}
                        />
                        <Button label="Commit" type="submit" disabled={jsonError !== null} className="w-28" />
                    </div>
                </div>

            </div>
        );
    };
