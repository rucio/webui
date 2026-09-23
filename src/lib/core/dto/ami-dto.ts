import { BaseDTO } from '@/lib/sdk/dto';

/** Subset of AMI tag information we surface in the UI. */
export interface AMITagDetails {
    productionStep?: string;
    baseRelease?: string;
    transformation?: string;
    description?: string;
    created?: string;
    createdBy?: string;
}

/**
 * Result of an AMIGetAMITagInfo lookup.
 * found=false means AMI answered but does not know the tag.
 */
export type AMITagInfoDTO = BaseDTO &
    AMITagDetails & {
        tag: string;
        found: boolean;
    };
