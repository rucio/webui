'use client';
import React from 'react';
import { SessionUser } from '@/lib/core/entity/auth-models';

export default function Dashboard(props: any) {
  const user: SessionUser = props.user;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!!</p>
    </div>
  );
}

