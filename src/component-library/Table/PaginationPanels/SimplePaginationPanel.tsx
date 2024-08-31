import {HiChevronLeft, HiChevronRight} from "react-icons/hi";
import {RefObject} from "react";
import {twMerge} from "tailwind-merge";

// This implementation of the pagination panel uses refs to prevent excessive state updates
/**
 * A component for flexible and responsive pagination of the table
 */
export const SimplePaginationPanel = (props: {
    currentPageRef: RefObject<HTMLSpanElement>,
    totalPagesRef: RefObject<HTMLSpanElement>,
    previousPageRef: RefObject<HTMLButtonElement>,
    nextPageRef: RefObject<HTMLButtonElement>,
    containerRef: RefObject<HTMLDivElement>
}) => {
    const enabledClasses = 'text-neutral-900 dark:text-neutral-100';
    const disabledClasses = 'disabled:text-neutral-400 disabled:dark:text-neutral-600';
    const buttonClasses = twMerge(
        "text-xl",
        enabledClasses,
        disabledClasses
    );

    return <div ref={props.containerRef} className={twMerge(
        "flex items-center justify-center",
        enabledClasses,
        "py-1",
        "invisible"
    )}>
        <button
            disabled={true}
            ref={props.previousPageRef}
            className={buttonClasses}
        >
            <HiChevronLeft/>
        </button>
        <span className="px-3">
            Page <span ref={props.currentPageRef}>0</span> of <span ref={props.totalPagesRef}>0</span>
        </span>
        <button
            disabled={true}
            ref={props.nextPageRef}
            className={buttonClasses}
        >
            <HiChevronRight/>
        </button>
    </div>
};