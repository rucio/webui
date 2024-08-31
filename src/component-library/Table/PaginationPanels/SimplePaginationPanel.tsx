import {
    HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight,
    HiOutlineChevronLeft,
    HiOutlineChevronRight
} from "react-icons/hi";
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
    lastPageRef: RefObject<HTMLButtonElement>,
    firstPageRef: RefObject<HTMLButtonElement>,
    containerRef: RefObject<HTMLDivElement>
}) => {
    const enabledTextClasses = 'text-neutral-900 dark:text-neutral-100';
    const disabledTextClasses = 'disabled:text-neutral-400 disabled:dark:text-neutral-500';
    const buttonClasses = twMerge(
        "text-l",
        "px-1",
        enabledTextClasses,
        disabledTextClasses
    );

    return <div className={twMerge(
        "flex items-center justify-center",
        enabledTextClasses,
        "py-2 !m-0",
        "bg-neutral-200 dark:bg-neutral-700",
        "border border-solid",
        "border-neutral-900 dark:border-neutral-100",
        "border-opacity-10 dark:border-opacity-10",
        "rounded-b-md",
    )}>
        <div className="flex justify-center invisible" ref={props.containerRef}>
            <button
                disabled={true}
                ref={props.firstPageRef}
                className={buttonClasses}
            >
                <HiOutlineChevronDoubleLeft/>
            </button>
            <button
                disabled={true}
                ref={props.previousPageRef}
                className={buttonClasses}
            >
                <HiOutlineChevronLeft/>
            </button>
            <span className="px-3">
                Page <span ref={props.currentPageRef}>0</span> of <span ref={props.totalPagesRef}>0</span>
            </span>
            <button
                disabled={true}
                ref={props.nextPageRef}
                className={buttonClasses}
            >
                <HiOutlineChevronRight/>
            </button>
            <button
                disabled={true}
                ref={props.lastPageRef}
                className={buttonClasses}
            >
                <HiOutlineChevronDoubleRight/>
            </button>
        </div>
    </div>
};