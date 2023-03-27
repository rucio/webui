import { useState } from "react"

type Data = {
    data: Element[]
    error: string
    state: boolean
}
export default function StateTable<T extends Data>() {
    
    const [data, setData] = useState<T[]>([])
    return (
        <div>
            <div>
                
            </div>
            <div>

            </div>
        </div>
    )
}