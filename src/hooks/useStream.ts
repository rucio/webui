import React from "react"

export default function useStream(url: string, component: React.Component) {
    const [stream, setStream] = React.useState<ReadableStream | null>(null)
    const deferredStream = React.useDeferredValue(stream)
    const fetchStream = React.useCallback(async () => {
        const res = await fetch('/api/stream')
        const stream = res.body
        setStream(stream)
    }, [])

    return { stream, deferredStream }
}