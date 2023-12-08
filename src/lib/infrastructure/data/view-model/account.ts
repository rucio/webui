import { AccountInfo, AccountStatus, AccountType } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface AccountInfoViewModel extends BaseViewModel, AccountInfo {}

export function generateEmptyAccountInfoViewModel(): AccountInfoViewModel {
    return {
        status: "error",
        account: "",
        accountType: AccountType.UNKNOWN,
        accountStatus: AccountStatus.UNKNOWN,
        email: "",
        createdAt: "",
        updatedAt: "",
    } as AccountInfoViewModel
}