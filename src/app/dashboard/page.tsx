'use client';
import React from 'react';
import { RucioUser } from '@/lib/core/entity/auth-models';

export default function Dashboard(props: any) {
  const user: RucioUser = props.user;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard, {user.rucioIdentity}</p>
    </div>
  );
}

