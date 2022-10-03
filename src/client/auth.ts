import { AuthConfig } from '../utils/config'
import { AuthError } from '../utils/exceptions'
import { AuthModel } from '../utils/models'
import { getData } from '../utils/restApiWrapper'

class Auth extends AuthModel {
    public static async userpassAuthCall(
        userpassPayload: AuthType,
        onSuccess = (args?: unknown) => args,
        onError = (args?: unknown) => args,
    ) {
        getData(AuthConfig.endpoints.userpass, {}, userpassPayload)
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
                        throw AuthError.fromType('USERPASS_NO_HEADER')
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
