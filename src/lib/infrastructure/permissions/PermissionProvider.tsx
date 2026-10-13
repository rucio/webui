'use client';

import { useEffect } from 'react';
import { PermixProvider } from 'permix/react';
import { useSession } from 'next-auth/react';
import { Role } from '@/lib/core/entity/auth-models';
import { permix, adminTemplate, userTemplate } from '@/lib/core/permissions';

export function PermissionProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    useEffect(() => {
        const user = session?.user;
        if (!user) return;

        permix.setup(user.role === Role.ADMIN ? adminTemplate() : userTemplate(user));
    }, [session]);

    return <PermixProvider permix={permix}>{children}</PermixProvider>;
}
