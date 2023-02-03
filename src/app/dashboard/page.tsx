'use client';
import React from 'react';
import { withSessionSsr } from '@/lib/infrastructure/auth/withSession';
import useUser from '@/lib/infrastructure/hooks/useUser';

export default function Dashboard() {
  const { user } = useUser({
    redirectTo: '/login',
    redirectIfFound: false,
  });
  if (!user?.isLoggedIn) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>You are not logged in</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard, {user?.rucioIdentity}</p>
    </div>
  );
}


// export const getServerSideProps = withSessionSsr(
//   async function getServerSideProps({ req }) {
//     const user = req.session.user;

//     if (user?.isLoggedIn !== true) {
//       return {
//         notFound: true,
//       };
//     }

//     return {
//       props: {
//         user: req.session.user,
//       },
//     };
//   },
// );