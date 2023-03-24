'use client';
import "reflect-metadata";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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


console.log("THIS ACTUALLY WORKS")
// const root = document.getElementById('table-body');
// if (root === null) {
//     console.log('root is null')
// }else {
//     console.log('root is not null')
// }