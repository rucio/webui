import { streamData } from '../utils/restApiWrapper'
import { DIDModel } from '../utils/models'

class DID extends DIDModel {
    public static search(scope: string, name: string, type: string) {
        const url = '/dids/' + scope + '/dids/search'
        return streamData(url, {
            name,
            type,
        })
    }
    public static get_did(scope: string, name: string, dynamic: boolean) {
        let url = '/dids/' + scope + '/' + name
        if (dynamic === true) {
            url += '?dynamic=' + dynamic
        }
        return streamData(url)
    }
}

export { DID }
