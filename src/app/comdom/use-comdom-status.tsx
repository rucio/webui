import { UseComDOMStatus } from "@/lib/infrastructure/hooks/useComDOM";
import { QueryStatus } from "@tanstack/react-query";
import { useMemo } from "react";
import QueryInfo from "./query-info";

type UseComDomStatusCardProps = {
    status: UseComDOMStatus
}
export default function UseComDOMStatusCard({status: useComDOMStatus}: UseComDomStatusCardProps){
    const status = useMemo(() => {
        switch(useComDOMStatus){
            case UseComDOMStatus.STOPPED:
                return 'Stopped'
            case UseComDOMStatus.RUNNING:
                return 'loading'
            case UseComDOMStatus.DONE:
                return 'success'
            case UseComDOMStatus.ERROR:
                return 'error'
            case UseComDOMStatus.PAUSED:
                return 'paused'
            default:
                return 'unknown'
        }
    }, [useComDOMStatus])
    
    return (
        <QueryInfo  title="UseComDOM Hook Status" status={status} realStatus={useComDOMStatus.toString()} />
    )
}