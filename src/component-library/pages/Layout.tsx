import React, { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex flex-col grow px-4 py-6 sm:px-8 md:px-12 lg:px-24 xl:px-32 2xl:px-48 3xl:px-64">{children}</main>
        </div>
    );
};
