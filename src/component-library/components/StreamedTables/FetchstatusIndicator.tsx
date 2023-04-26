import { TbLoader2 } from 'react-icons/tb'
import { FetchStatus } from '@tanstack/react-query'
import { HiPause, HiMoon } from 'react-icons/hi'
import { twMerge } from 'tailwind-merge'

export const FetchstatusIndicator = (props: {
    status: FetchStatus
}) => {
    switch (props.status) {
        case "fetching":
            return (
                <div
                    className={twMerge(
                        "flex justify-between items-center border p-1 rounded-md w-32",
                        "bg-amber-200"
                    )}
                >
                    <div
                        className={twMerge(
                            "h-6 w-6",
                        )}
                    >
                        <TbLoader2
                            className={twMerge(
                                "w-full h-full animate-spin",
                                "text-amber-800"
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
                                "text-amber-800",
                                "font-semibold tracking-wide"
                            )}
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
                        "flex justify-between items-center border p-1 rounded-md w-32",
                        "bg-blue-200"
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
                                "text-blue-800"
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
                                "text-blue-800",
                                "font-semibold tracking-wide"
                            )}
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
                        "flex justify-between items-center border p-1 rounded-md w-32",
                        "bg-stone-200"
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
                                "text-stone-800"
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
                                "text-stone-800",
                                "font-semibold tracking-wide"
                            )}
                        >
                            Paused
                        </label>
                    </div>
                </div>
            )
    }
}