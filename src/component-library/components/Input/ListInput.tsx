import { useState, useEffect } from "react"
import { Button } from "../Button/Button"
import { TextInput } from "./TextInput"

export const ListInput = (
    props: {
        onAdd: (value: string) => void,
        onRemove: (value: string) => void,
        placeholder: string,
        value: Array<string>
        id?: string,
    }
) => {

    const [items, setItems] = useState(props.value)
    useEffect(() => {
        setItems(props.value)
    }, [props.value])

    let ClickableItem = (item: string) => {
        return (
            <div id={props.id} className="w-full flex flex-row hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900">
                <div className="grow text-align-center">
                    <p className="m-2 font-mono dark:text-white">{item}</p>
                </div>
                <div className="w-12 p-1">
                    <Button
                        type="reset"
                        label="X"
                        onClick={() => {
                            setItems(items.filter((i) => i !== item))
                            props.onRemove(item)
                        }}
                    />
                </div>
            </div>
        )
    }

    /*
    remaining todo:
    > allow user to edit the items again
    > some sort of pulse if the user tries to add an item that already exists
    > reset entire thing
    > style the input box
    */

    return (
        <div className="w-full border dark:border-2 rounded-md">
            <div className="w-full flex flex-row">
                <TextInput
                    id={props.id}
                    placeholder={props.placeholder}
                    onEnterkey={(e) => {
                        let val = e.currentTarget.value
                        if (items.indexOf(val) === -1) {
                            // if val is not in items, add it
                            setItems([val, ...items])
                            props.onAdd(val)
                            e.currentTarget.value = ""
                        } else {
                            // TODO add some sort of ping/flash here
                            e.currentTarget.value = ""
                        }
                    }}
                />
            </div>
            <div className="w-full h-56 overflow-y-auto">
                {items.map((item) => {
                    return ClickableItem(item)
                })}
            </div>
        </div>
    )
}