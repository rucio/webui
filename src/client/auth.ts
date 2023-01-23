import { AuthConfig } from '../utils/config'
import { AuthError } from '../utils/exceptions'
import { AuthModel } from '../utils/models'
import { getData } from '../utils/restApiWrapper'

class Auth extends AuthModel {
    public static async userpassAuthCall(
        headers: AuthHeaders,
        authHost: string | undefined,
        onSuccess = (args?: unknown) => args,
        onError = (args?: unknown) => args,
    ) {
        getData(AuthConfig.endpoints.userpass, {}, headers, authHost)
            .then((response: any) => {
                if (response.status === 200) {
                    const rucioAuthToken =
                        response?.headers.get('X-Rucio-Auth-Token')

                    sessionStorage.setItem('X-Rucio-Auth-Token', rucioAuthToken)
                } else if (response.status == 206) {
                    const has_accounts_header = response.headers.has(
                        'X-Rucio-Auth-Accounts',
                    )
                    if (!has_accounts_header) {
                        throw AuthError.fromType('NO_ACCOUNTS_LIST_PROVIDED')
                    }
                } else {
                    throw AuthError.fromType('COMMON_LOGIN_FAILED')
                }
                onSuccess(response)
            })
            .catch((error: Error) => {
                console.error(error)
                onError(error)
            })
    }

    public static async x509AuthCall(
        headers: AuthHeaders,
        authHost: string | undefined,
        onSuccess = (args?: unknown) => args,
        onError = (args?: unknown) => args,
    ) {
        getData(AuthConfig.endpoints.x509, {}, headers, authHost)
            .then((response: any) => {
                if (response.status === 200) {
                    const rucioAuthToken =
                        response?.headers.get('X-Rucio-Auth-Token')

                    sessionStorage.setItem('X-Rucio-Auth-Token', rucioAuthToken)
                } else if (response.status == 206) {
                    const has_accounts_header = response.headers.has(
                        'X-Rucio-Auth-Accounts',
                    )
                    if (!has_accounts_header) {
                        throw AuthError.fromType('NO_ACCOUNTS_LIST_PROVIDED')
                    }
                } else {
                    throw AuthError.fromType('COMMON_LOGIN_FAILED')
                }
                onSuccess(response)
            })
            .catch((error: Error) => {
                console.error(error)
                onError(error)
            })
    }
}

export { Auth }
