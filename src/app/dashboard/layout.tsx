import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRucioAuthToken } from '@/lib/infrastructure/auth/session-utils'
import { ReadonlyRequestCookies } from 'next/dist/server/app-render';
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const all_cookies: RequestCookies | ReadonlyRequestCookies = cookies()
  const rucioAuthToken = await getRucioAuthToken(all_cookies)
  if (!rucioAuthToken || rucioAuthToken === '') {
    redirect('/auth/login')
  }
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {children}
      </body>
    </html>
  )
}
