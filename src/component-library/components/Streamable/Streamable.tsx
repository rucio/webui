'use client';
import { FC, useDeferredValue, useState } from "react"

export const Entity = (props: {data: string}) => {
    return (
        <div>
            <p>{props.data}</p>
        </div>
    )
}

export const Streamable = async (props: {url:string}) => {
    const [data, setData] = useState([] as string[]);
    const deferredData = useDeferredValue(data)
    const res = await fetch(props.url)
    try {
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        if (!res.body) {
            throw new Error("No body")
        }
        const reader = res.body.getReader()
        while (true) {
            const { done, value } = await reader.read()
            if (done) {
                break
            }
            const text = new TextDecoder("utf-8").decode(value)
            setData( (prevData) => {
                return [...prevData, text];
            })
        }
    }catch (e) {
        console.log(e)
    }
    return (
        <div>{
            deferredData.map((item) => {
                return (<Entity key={item} data={item}/>)
            })
        })
        </div>
    )
}