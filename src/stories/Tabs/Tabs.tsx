import './tabs.scss'

export const Tabs = ({
    tabs = [],
    active,
    alignment,
    size,
    rounded,
    boxed,
    fullwidth,
    ...props
}: TabsProps) => {
    return (
        <div
            className={`rucio-tabs 
            ${alignment} ${size} ${rounded} ${boxed} ${fullwidth}`}
        >
            <ul>
                {tabs.map((element, index) => {
                    return index === active ? (
                        <li
                            onClick={props.handleClick}
                            className="is-active"
                            key={index}
                        >
                            <a id={index.toString()}>{element}</a>
                        </li>
                    ) : (
                        <li onClick={props.handleClick} key={index}>
                            <a id={index.toString()}>{element}</a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
