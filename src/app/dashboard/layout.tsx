import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRucioAuthToken, getSessionUser } from '@/lib/infrastructure/auth/session-utils'
import { ReadonlyRequestCookies } from 'next/dist/server/app-render';
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import { SessionUser } from "@/lib/core/entity/auth-models";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const all_cookies: RequestCookies | ReadonlyRequestCookies = cookies()
  const sessionUser: SessionUser | undefined = await getSessionUser(all_cookies as unknown as ReadonlyRequestCookies)
  const rucioAuthToken = await getRucioAuthToken(all_cookies)
  if (!rucioAuthToken || rucioAuthToken === '') {
    const callbackUrl = encodeURIComponent('/dashboard')
    const loginUrl = `/api/auth/login?callbackUrl=${callbackUrl}`
    redirect(loginUrl)
  }
  return (
    <div>
    <h3>You are logged in as {sessionUser?.rucioIdentity}</h3>
        {children}
    </div>
  )
}
