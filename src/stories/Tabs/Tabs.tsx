import './tabs.scss'

interface TabsProps {
    tabs: Array<string>
    active: number
    alignment?: 'right' | 'centered'
    size?: 'small' | 'medium' | 'large'
    rounded?: 'toggle' | 'toggle-rounded'
    boxed?: 'boxed'
    fullwidth?: 'fullwidth'
    handleClick: (args: any) => void
}

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
                        <li onClick={props.handleClick} className="is-active">
                            <a>{element}</a>
                        </li>
                    ) : (
                        <li onClick={props.handleClick}>
                            <a>{element}</a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
