import { useState, useEffect } from 'react'

import { TbLoader2 } from 'react-icons/tb'
import { FetchStatus } from '@tanstack/react-query'
import { HiPause, HiMoon } from 'react-icons/hi'
import { twMerge } from 'tailwind-merge'

export const FetchstatusIndicator = (props: {
    status: FetchStatus
}) => {
    const [status, setStatus] = useState<FetchStatus>(props.status)
    useEffect(() => {
        setStatus(props.status)
    }, [props.status])
    switch (props.status) {
        case "fetching":
            return (
                <div
                    className={twMerge(
                        "flex justify-between items-center p-1 rounded-md w-32 shadow-md",
                        "bg-amber-200 dark:bg-amber-900"
                    )}
                >
                    <div
                        className={twMerge(
                            "h-6 w-6",
                        )}
                    >
                        <TbLoader2
                            className={twMerge(
                                "w-full h-full animate-slowspin",
                                "text-amber-800 dark:text-amber-300"
                            )}
                            id="spinnywheel"
                        />
                    </div>
                    <div
                        className={twMerge(
                            "grow text-center",
                        )}
                    >
                        <label
                            className={twMerge(
                                "text-amber-800 dark:text-amber-300",
                                "font-semibold tracking-wide"
                            )}
                            htmlFor="spinnywheel"
                        >
                            Fetching
                        </label>
                    </div>
                </div>
            )
        case "idle":
            return (
                <div
                    className={twMerge(
                        "flex justify-between items-center p-1 rounded-md w-32 shadow-md",
                        "bg-blue-200 dark:bg-blue-900",
                        "animate-fadeout fill-mode-forwards"
                    )}
                >
                    <div
                        className={twMerge(
                            "h-6 w-6",
                        )}
                    >
                        <HiMoon
                            className={twMerge(
                                "w-full h-full",
                                "text-blue-800 dark:text-blue-300"
                            )}
                            id="spinnywheel"
                        />
                    </div>
                    <div
                        className={twMerge(
                            "grow text-center",
                        )}
                    >
                        <label
                            className={twMerge(
                                "text-blue-800 dark:text-blue-300",
                                "font-semibold tracking-wide"
                            )}
                            htmlFor="spinnywheel"
                        >
                            Idle
                        </label>
                    </div>
                </div>
            )
        case "paused":
            return (
                <div
                    className={twMerge(
                        "flex justify-between items-center p-1 rounded-md w-32 shadow-md",
                        "bg-stone-200 dark:bg-stone-900",
                    )}
                >
                    <div
                        className={twMerge(
                            "h-6 w-6",
                        )}
                    >
                        <HiPause
                            className={twMerge(
                                "w-full h-full",
                                "text-stone-800 dark:text-stone-300"
                            )}
                            id="spinnywheel"
                        />
                    </div>
                    <div
                        className={twMerge(
                            "grow text-center",
                        )}
                    >
                        <label
                            className={twMerge(
                                "text-stone-800 dark:text-stone-300",
                                "font-semibold tracking-wide"
                            )}
                            htmlFor="spinnywheel"
                        >
                            Paused
                        </label>
                    </div>
                </div>
            )
    }
}