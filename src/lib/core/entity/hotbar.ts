/**
 * HotBar entity - User bookmarks for quick access
 */

export enum HotBarCardType {
    DID = 'DID',
    DID_LIST = 'DID_LIST',
    RULE = 'RULE',
    RULE_LIST = 'RULE_LIST',
    RSE = 'RSE',
    RSE_LIST = 'RSE_LIST',
}

export interface HotBarCard {
    id: string;
    title: string;
    description?: string;
    url: string;
    type: HotBarCardType;
    created_at: string;
    updated_at: string;
}

/**
 * Type for creating a new HotBar card (without id and timestamps)
 */
export interface CreateHotBarCard {
    title: string;
    description?: string;
    url: string;
}

/**
 * Type for updating an existing HotBar card
 */
export interface UpdateHotBarCard {
    title?: string;
    description?: string;
    url?: string;
}
