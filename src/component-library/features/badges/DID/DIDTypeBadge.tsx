import React from 'react';
import {DIDType} from '@/lib/core/entity/rucio';
import {Badge} from '@/component-library/atoms/misc/Badge';
import {twMerge} from 'tailwind-merge';

const typeColorClasses: Record<DIDType, string> = {
    All: "bg-neutral-500",
    Collection: "bg-base-info-500",
    Container: "bg-extra-emerald-500",
    Dataset: "bg-extra-yellow-400",
    Derived: "bg-neutral-500",
    File: "bg-extra-rose-500",
    Unknown: "bg-neutral-500",
};

export const DIDTypeBadge = (props: { value: DIDType; className?: string }) => {
    const classes = twMerge(typeColorClasses[props.value], props.className);
    return <Badge value={props.value} className={classes}/>;
};
