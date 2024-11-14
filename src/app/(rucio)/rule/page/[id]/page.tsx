'use client';

import { DetailsRule } from '@/component-library/pages/Rule/details/DetailsRule';
import {useEffect} from "react";

export default function PageRule({ params }: { params: { id: string } }) {
    useEffect(() => {
        document.title = 'Rule - Rucio';
    }, []);
    
    return <DetailsRule id={params.id} />;
}
