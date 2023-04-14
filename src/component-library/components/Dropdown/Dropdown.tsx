import { useState } from 'react'
import { Button } from '../Button/Button'
import { Collapsible } from '../Helpers/Collapsible'

export const Dropdown = (
    props: {
        label: string,
        options: Array<string>,
        handleChange: (args: any) => void,
        id?: string
    }
    ) => {
    const [isActive, setActive] = useState<boolean>(false)
    const [selectedLabel, setSelectedLabel] = useState<string>(props.label)
    let icon = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
            </svg>
        )
    }
    return (
        <div className="w-full relative">
            <Button label={selectedLabel} onClick={() => {setActive(!isActive)}} icon={icon()} />
            <Collapsible showIf={isActive}>
                <div className="absolute right-0 mt-2 w-56 rounded border">
                    <div className="p-2 flex flex-col bg-white">
                        <ol>
                            {props.options.map((element: any, index: number) => {
                                return (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            setActive(!isActive);
                                            props.handleChange(element);
                                            setSelectedLabel(element);
                                        }}
                                        className="hover:bg-gray-200"
                                    >
                                        {element}
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                </div>
            </Collapsible>
        </div>
    )
}

        // <div classNameName="">
        //     <div classNameName="dropdown-trigger">
        //         <button
        //             classNameName="button"
        //             aria-haspopup="true"
        //             aria-controls="dropdown-menu"
        //             onClick={() => {
        //                 setActive(!isActive)
        //             }}
        //         >
        //             <span>{selectedlabel}</span>
        //             <span classNameName="icon is-small">
        //                 <p>&#9660;</p>
        //             </span>
        //         </button>
        //     </div>
        //     <div
        //         classNameName="dropdown-menu"
        //         id="dropdown-menu"
        //         role="menu"
        //         onClick={(event: any) => {
        //             setActive(false)
        //             setSelectedLabel(event?.target?.value)
        //             handleChange?.(event)
        //         }}
        //     >
        //         <div classNameName="dropdown-content">
        //             {options.map((element: any, index: number) => (
        //                 <option
        //                     classNameName={'dropdown-item'}
        //                     value={element}
        //                     key={index}
        //                 >
        //                     {element}
        //                 </option>
        //             ))}
        //         </div>
        //     </div>
        // </div>