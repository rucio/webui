import { AccountLimitModel } from '../utils/models'
import { streamData } from '../utils/restApiWrapper'

class AccountLimit extends AccountLimitModel {
    public static getAccountLimits(account: AccountType): object {
        const url = '/accounts/' + account + '/limits'
        return streamData(url)
    }
}

export { AccountLimit }
