import { streamData } from "../utils/restApiWrapper"

export function search(scope: string, name: string, type: string) {
    const url = "/dids/" + scope + "/dids/search"
    return streamData(url, {
            "name": name,
            "type": type
        }
    )
}

export function get_did(scope:string, name:string, dynamic:boolean, rucioToken:string){
    let url = "/dids/" + scope + '/' + name
    if (dynamic===true) {url+='?dynamic=' + dynamic}
    return streamData(
        url,
        {},
        {
            'X-Rucio-Auth-Token': rucioToken
        }
    )
}