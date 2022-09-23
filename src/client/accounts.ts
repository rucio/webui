import { parsedEndpoint } from '../util'
import { AccountConfig } from '../utils/config'
import { AccountModel } from '../utils/models'
import { streamData, deleteData, postData } from '../utils/restApiWrapper'

class Account extends AccountModel {
    public static getAttributes(): object {
        return {}
    }
    public static createAttribute(): object {
        return {}
    }
    public static deleteAttribute(): object {
        return {}
    }
    public static getScopes(): object {
        return {}
    }
    public static createScope(): object {
        return {}
    }
    public static getParameters(): object {
        return {}
    }
    public static updateParameter(): object {
        return {}
    }

    // Approach 1, avoids callback hell, no promises returned (inline functions + callbacks)
    public static async create(
        createPayload: AccountType,
        onSuccess = (args?: unknown) => args,
        onError = (args?: unknown) => args,
    ) {
        const createEndpoint: string = parsedEndpoint(
            AccountConfig?.endpoints?.account,
            createPayload,
        )
        postData(createEndpoint)
            .then((response: any) => {
                // throw custom exceptions if required/necessary from here, before calling onSuccess
                onSuccess(response)
            })
            .catch((error: Error) => {
                console.error(error)
                onError(error)
            })
    }

    // Approach 2, returns promise, need to .then() on it in the react pages, handle exceptions on react side
    public static async delete(
        deletePayload: AccountType,
        onSuccess = (args?: unknown) => args,
        onError = (args?: unknown) => args,
    ): Promise<unknown> {
        const deleteEndpoint: string = parsedEndpoint(
            AccountConfig?.endpoints?.account,
            deletePayload,
        )
        return await deleteData(deleteEndpoint)
    }
    public static listAll(): object {
        return {}
    }
    public static getLocalLimit(): object {
        return {}
    }
    public static getGlobalLimit(): object {
        return {}
    }
    public static createIdentity(): object {
        return {}
    }
    public static getIdentities(): object {
        return {}
    }
    public static deleteIdentity(): object {
        return {}
    }
    public static listRules(): object {
        return {}
    }
    public static getUsageHistory(account:string, rse:string): object {
        let url='/accounts/' + account + '/usage/'
        if (rse.length>0) {url+=rse}    
        return streamData(url)
    }
    public static getLocalUsage(): object {
        return {}
    }
    public static getGlobalUsage(): object {
        return {}
    }
}

export { Account }