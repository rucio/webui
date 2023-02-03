'use client';
import React from 'react';
import withSession from '@/components/auth-wrapper';
import { RucioUser } from '@/lib/core/entity/auth-models';

const Dashboard = (props: any) => {
  const user: RucioUser = props.user;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard, {user.rucioIdentity}</p>
    </div>
  );
}

export default withSession(Dashboard);
