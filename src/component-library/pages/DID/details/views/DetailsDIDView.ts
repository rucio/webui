import React from 'react';
export type DetailsDIDProps = {
    scope: string;
    name: string;
    isActive?: boolean;
};

export type DetailsDIDView = (props: DetailsDIDProps) => React.ReactElement;
