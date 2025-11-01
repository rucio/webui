'use client';

import { DetailsRule } from '@/component-library/pages/Rule/details/DetailsRule';
import { use, useEffect } from 'react';

export default function PageRule({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    useEffect(() => {
        document.title = 'Rule - Rucio';
    }, []);

    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <section aria-label="Rule Details">
                    <DetailsRule id={id} />
                </section>
            </div>
        </main>
    );
}
