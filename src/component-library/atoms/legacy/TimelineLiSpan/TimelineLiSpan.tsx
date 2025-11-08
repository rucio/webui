export const TimelineLiSpan = (props: { children: any; highlight: boolean; completed?: boolean }) => {
    const classes = ['h-10', 'w-10', 'rounded-full', 'text-center', 'text-xl', 'font-bold', 'leading-10'];
    const highlightClasses = classes.concat('bg-base-info-600', 'text-neutral-0');
    const completedClasses = classes.concat('bg-base-success-600', 'text-neutral-0');
    const normalClasses = classes.concat('bg-neutral-200', 'dark:bg-neutral-600');
    return (
        <span className={props.highlight ? highlightClasses.join(' ') : props.completed ? completedClasses.join(' ') : normalClasses.join(' ')}>
            <h3>{props.children}</h3>
        </span>
    );
};
