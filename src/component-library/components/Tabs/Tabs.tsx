import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export const Tabs: React.FC<JSX.IntrinsicElements["ul"] & {
    tabs: string[],
    _ariaControls?: string[],
    active: number,
    updateActive: (active: number) => void,
}> = (
    {
        tabs,
        active,
        updateActive,
        ...props
    }
) => {
        const { className, ...otherprops } = props

        /*
        ARIA for tabs:
          - `Tab` places focus on *active* tab. Tabbing again will move focus
          into the tabpanel. It is *not* possible to cycle through the tabs with
          the tab key.
          - `left arrow` and `right arrow` keys move focus between tabs.
          - we use buttons with role="tab" in a div with role="tablist" to implement this.
        Refer to https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role#example
        */
        const [activestate, setActivestate] = useState<number>(active) // handle state internally
        useEffect(() => {
            setActivestate(active)
        }, [active]) // update internal state when external factors (props) change
        useEffect(() => {
            document.getElementById(`tab-${activestate.toString()}`)?.focus()
        }, [activestate]) // focus on tab when internal state changes
        const changeFunc = (id: number) => {
            var newId = id
            if (id < 0) {
                newId = tabs.length - 1
            }
            if (id >= tabs.length) {
                newId = 0
            }
            setActivestate(newId)
            updateActive(newId)
        } // update internal state and external state when tab is clicked
        const changeFuncEvent = (event: any) => {
            changeFunc(Number(event.target.dataset.id))
        } // wrap for event handler
        return (
            <div
                className={twMerge(
                    "flex flex-col sm:flex-row",
                    "list-none font-bold",
                    "bg-white dark:bg-gray-900",
                )}
                role="tablist"
            >
                {tabs.map((element, index) => {
                    return index === Number(activestate) ? (
                        <button
                            onClick={changeFuncEvent}
                            data-id={index.toString()}
                            className={twMerge(
                                "flex-1 p-4 hover:cursor-pointer",
                                "border-b-4 border-blue-500",
                                "text-blue-500 hover:bg-gray-100 dark:hover:bg-transparent"
                            )}
                            key={index.toString()} // required by react
                            role="tab"
                            aria-selected="true"
                            tabIndex={0}
                            aria-controls={props._ariaControls ? props._ariaControls[index] : ""}
                            id={`tab-${index.toString()}`} // indexed as tab-0, tab-1, etc. Refer to this in the tabpanels.
                            onKeyDown={(event) => {
                                if (event.key === "ArrowLeft") {
                                    changeFunc(index - 1)
                                }
                                if (event.key === "ArrowRight") {
                                    changeFunc(index + 1)
                                }
                            }}

                        >
                            <span
                            >
                                {element}
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={changeFuncEvent}
                            data-id={index.toString()}
                            className={twMerge(
                                "flex-1 p-4 hover:cursor-pointer",
                                "border-b-4 border-gray-300 dark:border-gray-100",
                                "text-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-transparent"
                            )}
                            key={index.toString()}
                            role="tab"
                            aria-selected="false"
                            tabIndex={-1}
                            aria-controls={props._ariaControls ? props._ariaControls[index] : ""}
                            onKeyDown={(event) => {
                                if (event.key === "ArrowLeft") {
                                    changeFunc(index - 1)
                                }
                                if (event.key === "ArrowRight") {
                                    changeFunc(index + 1)
                                }
                            }}
                        >
                            <span
                            >
                                {element}
                            </span>
                        </button>
                    )
                })}
            </div>
        )
    }
