export const TimelineLiSpan = (props: { children: any; highlight: boolean; completed?: boolean }) => {
    var classes = ['h-10', 'w-10', 'rounded-full', 'text-center', 'text-xl', 'font-bold', 'leading-10'];
    var highlightClasses = classes.concat('bg-blue-600', 'text-white');
    var completedClasses = classes.concat('bg-green-600', 'text-white');
    var normalClasses = classes.concat('bg-gray-200', 'dark:bg-gray-600');
    return (
        <span className={props.highlight ? highlightClasses.join(' ') : props.completed ? completedClasses.join(' ') : normalClasses.join(' ')}>
            <h3>{props.children}</h3>
        </span>
    );
};
