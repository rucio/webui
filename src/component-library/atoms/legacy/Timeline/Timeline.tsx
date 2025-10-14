import { TimelineLiSpan } from '../TimelineLiSpan/TimelineLiSpan';
import { H3 } from '../text/headings/H3/H3';
import { twMerge } from 'tailwind-merge';

export const Timeline = (props: { steps: Array<string>; active: number; onJump: (goal: number) => void }) => {
    const classes = twMerge('flex items-center gap-2 rounded-md', 'p-2', 'bg-neutral-0', 'dark:bg-neutral-800');

    return (
        <div className="rounded-md p-2  bg-neutral-0 dark:bg-neutral-800">
            <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-neutral-100 dark:after:bg-neutral-600">
                <ol className="relative z-10 flex justify-between text-sm font-medium text-text-700 dark:text-text-100">
                    {props.steps.map((element: any, index: number) => {
                        // the black bgs are not actually the same colour, dont understand why
                        return (
                            <li
                                className={twMerge(classes, index < props.active ? 'hover:cursor-pointer' : 'hover:cursor-default')}
                                key={index}
                                onClick={() => {
                                    if (index < props.active) {
                                        props.onJump(index);
                                    }
                                }}
                            >
                                <TimelineLiSpan highlight={index === props.active} completed={index < props.active}>
                                    {index + 1}
                                </TimelineLiSpan>
                                <span className="hidden sm:block align-middle">
                                    <H3>{element}</H3>
                                </span>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>
    );
};
