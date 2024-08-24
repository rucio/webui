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
    return <div ref={props.containerRef} className={twMerge(
        "flex items-center justify-center",
        "text-neutral-100",
        "py-1",
        "invisible"
    )}>
        <button
            disabled={true}
            ref={props.previousPageRef}
            className="disabled:text-neutral-600 text-neutral-100 text-xl"
        >
            <HiChevronLeft/>
        </button>
        <span className="px-3">
            Page <span ref={props.currentPageRef}>0</span> of <span ref={props.totalPagesRef}>0</span>
        </span>
        <button
            disabled={true}
            ref={props.nextPageRef}
            className="disabled:text-neutral-600 text-neutral-100 text-xl"
        >
            <HiChevronRight/>
        </button>
    </div>
};