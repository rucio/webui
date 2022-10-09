import { getData, streamData } from '../utils/restApiWrapper'
import { DIDModel } from '../utils/models'
import { parsedEndpoint } from '../util'
import { DidConfig } from '../utils/config'

class DID extends DIDModel {
    public static search(
        scope: string,
        name: string,
        type: string,
        onSuccess?: (args?: unknown) => void,
        onError?: (args?: unknown) => void,
    ) {
        const url = '/dids/' + scope + '/dids/search'
        streamData(url, {
            name,
            type,
        })
            .then((data: any) => {
                const dids = [] as DIDModel[]
                for (const did of data) {
                    const didObj = new DIDModel(did)
                    dids.push(didObj)
                }
                onSuccess?.(dids)
            })
            .catch((error: any) => {
                console.error(error)
                onError?.(error)
            })
    }

    public static get_did(
        scope: string,
        name: string,
        dynamic: boolean,
        onSuccess?: (args?: unknown) => void,
        onError?: (args?: unknown) => void,
    ) {
        let url = parsedEndpoint(DidConfig.endpoints.did, {
            scope_name: scope + '/' + name,
        })
        if (dynamic === true) {
            url += '?dynamic=' + dynamic
        }
        streamData(url)
            .then((data: any) => {
                onSuccess?.(data)
            })
            .catch((error: any) => {
                console.error(error)
                onError?.(error)
            })
    }

    public static meta(
        scope: string,
        name: string,
        onSuccess?: (args?: unknown) => void,
        onError?: (args?: unknown) => void,
    ) {
        const url = parsedEndpoint(DidConfig.endpoints.metadata, {
            scope_name: scope + '/' + name,
        })
        getData(url)
            .then((data: any) => data?.json())
            .then((data: any) => {
                onSuccess?.(data)
            })
            .catch((error: any) => {
                console.error(error)
                onError?.(error)
            })
    }
}

export { DID }
