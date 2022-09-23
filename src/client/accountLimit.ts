import { streamData } from '../utils/restApiWrapper'

export function get_account_limits(account: string) {
    const url = '/accounts/' + account + '/limits'
    return streamData(url)
}
