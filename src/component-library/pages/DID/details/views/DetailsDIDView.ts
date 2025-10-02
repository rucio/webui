import React from 'react';
export type DetailsDIDProps = {
    scope: string;
    name: string;
};

export type DetailsDIDView = (props: DetailsDIDProps) => React.ReactElement;
