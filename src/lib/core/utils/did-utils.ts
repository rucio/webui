import { AccountType, DID, DIDType } from "../entity/rucio";

/**
 * Generates a new scope name for the account
 * @param account The rucio account name
 * @param accountType The rucio account type
 * @returns A new scope name for the account
 */
export const generateNewScope = (account: string, accountType: AccountType): string => {
    if(accountType === AccountType.USER) {
        return `user.${account}`;
    }else if(accountType === AccountType.GROUP) {
        return `group.${account}`;
    } else {
        // TODO: Handle Service Account like root
        return `user.${account}`;
    }
}


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
    } as DID
}