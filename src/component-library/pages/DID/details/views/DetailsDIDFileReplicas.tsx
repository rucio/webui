import React from 'react';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import { FileReplicasPFNPanel } from '@/component-library/pages/DID/details/views/FileReplicasPFNPanel';

export const DetailsDIDFileReplicas: DetailsDIDView = ({ scope, name, isActive }: DetailsDIDProps) => {
    return <FileReplicasPFNPanel scope={scope} name={name} isActive={isActive} idPrefix="file-replicas" />;
};
