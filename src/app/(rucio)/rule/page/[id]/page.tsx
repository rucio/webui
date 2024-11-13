'use client';

import { DetailsRule } from '@/component-library/pages/Rule/details/DetailsRule';

export default function PageRule({ params }: { params: { id: string } }) {
    return <DetailsRule id={params.id} />;
}
