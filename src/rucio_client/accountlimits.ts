import { streamData } from "../utils/restApiWrapper"

export function get_account_limits(account:string, rucioToken:string){
    const url='/accounts/' + account + '/limits'
    return streamData(
        url,
        {},
        {
            'X-Rucio-Auth-Token': rucioToken
        }
    )

}