import { AccountType, DID, DIDType } from '../entity/rucio';

/**
 * Generates a new scope name for the account
 * @param account The rucio account name
 * @param accountType The rucio account type
 * @returns A new scope name for the account
 */
export const generateNewScope = (account: string, accountType: AccountType): string => {
    if (accountType === AccountType.USER) {
        return `user.${account}`;
    } else if (accountType === AccountType.GROUP) {
        return `group.${account}`;
    } else {
        // TODO: Handle Service Account like root
        return `user.${account}`;
    }
};

/**
 * Generates a new DID name for the given DID
 * @param newScope A new scope name for the account that should be used for the derived DID
 * @param selectedDID The DID that the derived DID is being created from
 * @returns A DID object with type DIDType.DERIVED
 */
export const generateDerivedDIDName = (newScope: string, selectedDID: DID): DID => {
    const newName = `${newScope}.${selectedDID.name}_der${Date.now() / 1000}`;
    return {
        name: newName,
        scope: newScope,
        did_type: DIDType.DERIVED,
    } as DID;
};

export const generateSampleDIDName = (newScope: string, name: string) => {
    return `${newScope}.${name}_der${Date.now() / 1000}`;
};

/**
 * Generates a DID name by appending the current date and time
 * to a given scope in the format: `scope.r2d2_request.YYYY-MM-DD_HH-MM-SS`.
 */
export const generateRequestDIDName = (scope: string) => {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

    return `${scope}.r2d2_request.${formattedDate}`;
};
