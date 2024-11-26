import React, { ReactNode } from 'react';
import { Header } from '@/component-library/features/layout/Header';
import { Footer } from '@/component-library/features/layout/Footer';

type LayoutProps = {
    children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-0 dark:bg-neutral-900">
            <Header />
            <main className="flex flex-col grow px-4 py-6 sm:px-8 md:px-12 lg:px-24 xl:px-32 2xl:px-48 3xl:px-64">{children}</main>
            <Footer />
        </div>
    );
};
