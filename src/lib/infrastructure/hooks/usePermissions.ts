'use client';

import { usePermix } from 'permix/react';
import { permix } from '@/lib/core/permissions';

/**
 * Thin wrapper around usePermix bound to the singleton permix instance.
 * Returns { check, isReady }.
 */
export function usePermissions() {
    return usePermix(permix);
}
