import { streamData } from "../utils/restApiWrapper"

export function list_rses(expression:boolean, rucioToken:string){
    let url='/rses/'
    if (expression===true) 
        {url+='?expression=' + encodeURIComponent(expression)}
    return streamData(
        url,
        {},
        {
            'X-Rucio-Auth-Token': rucioToken
        }
    )
        
}