import type { UserPassLoginAuthServerDTO } from "@/lib/core/data/auth-server-dto";
import AuthServerGatewayOutputPort from "@/lib/core/port/secondary/auth-server-gateway-output-port";
import { injectable } from "inversify";


/**
 * Provides an implementation of the {@link AuthServerGatewayOutputPort} interface.
 * It makes calls to the Rucio Auth Server.
 */
@injectable()
class RucioAuthServer implements AuthServerGatewayOutputPort {
    async userpassLogin(username: string, password: string, account: string): Promise<UserPassLoginAuthServerDTO> {
        const authHost = process.env.RUCIO_AUTH_HOST
        const userpassEndpoint = '/auth/userpass'
        const url = authHost + userpassEndpoint
        let response = null
        let dto: UserPassLoginAuthServerDTO;

        try {
            response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Rucio-AppID': 'webui',
                'X-Rucio-Username': username,
                'X-Rucio-Password': password,
                'X-Rucio-Account': 'root'
            },

        })
        } catch (error: Error | any) {
            if(authHost === undefined || authHost === null || authHost === '') {
                dto = {
                    statusCode: 503,
                    message: 'Rucio Auth Server is not configured in the WebUI settings',
                    account: '',
                    authToken: '',
                }
            } else {
                dto = {
                    statusCode: 500,
                    message: 'Rucio Auth Server error: fetch failed. Reason: ' + error.cause.message,
                    account: '',
                    authToken: '',
                }
            }
            return Promise.resolve(dto)
        }
        if(!response){
            dto = {
                statusCode: 502,
                message: 'Rucio Auth Server did not return a response',
                account: '',
                authToken: '',
            }
            return Promise.resolve(dto)
        }

        if(response.status === 401) {
            dto = {
                statusCode: response.status,
                message: 'Invalid credentials',
                account: '',
                authToken: '',
            }
            return Promise.resolve(dto)
        }

        if(response.status === 200) {
            let dto: UserPassLoginAuthServerDTO = {
                statusCode: response.status,
                message: '',
                account: '',
                authToken: '',
            }
            const authToken = response.headers.get('X-Rucio-Auth-Token')
            const account = response.headers.get('X-Rucio-Auth-Account')
            
            if (!authToken || !account) {
                dto.message = 'Rucio Auth Server returned 200 but no auth token or account headers'
                dto.account = ''
                dto.authToken = ''
            } else {
                dto.authToken = authToken
                dto.account = account
            }
            
            return Promise.resolve(dto)

        } else {
            throw new Error('Unable to handle response from Rucio Auth Server')
        }
    }
}

export default RucioAuthServer