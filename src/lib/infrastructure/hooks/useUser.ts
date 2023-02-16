// This hook is used to get the user from the session on the client side
// 'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { SessionUser } from '@/lib/core/entity/auth-models'

export default function useUser({
    redirectTo = '',
    redirectIfFound = false,
} = {}) {
    const router = useRouter()
    const { data: user, mutate: mutateUser } = useSWR<SessionUser>('/api/auth/login')
    useEffect(() => {
        // if no redirect needed, just return (example: already on /dashboard)
        // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
        if (!redirectTo || !user) return

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !user?.rucioAuthToken) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user?.rucioAuthToken)
        ) {
            router.push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo])

    return { user, mutateUser }
}
