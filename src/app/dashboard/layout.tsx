import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRucioAuthToken } from '@/lib/infrastructure/auth/session-utils'
import { ReadonlyRequestCookies } from 'next/dist/server/app-render';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const rucioAuthToken = await getRucioAuthToken(cookies() as unknown as ReadonlyRequestCookies)
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
