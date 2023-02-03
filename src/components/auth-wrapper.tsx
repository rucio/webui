'use-client'
import useUser from "@/lib/infrastructure/hooks/useUser"
import { useRouter } from "next/navigation"
import { FC } from "react"

const withSession = (WrappedComponent: FC) => {
    return (props: any) => {
        const { user } = useUser({
            redirectTo: "/login",
            redirectIfFound: false,
        })

        const router = useRouter()
    
        if (!user || !user.rucioAuthToken) {
            router.push('/login')
            return null
        }

        return (
            <WrappedComponent user={user} {...props}/>
        )
    }
}

export default withSession