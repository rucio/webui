import { streamData } from "../utils/restApiWrapper"

export function get_account_usage(account:string, rse:string, rucioToken:string){
    let url='/accounts/' + account + '/usage/'
    if (rse.length>0) {url+=rse}
    return streamData(
        url,
        {},
        {
            'X-Rucio-Auth-Token': rucioToken
        }
    )

}