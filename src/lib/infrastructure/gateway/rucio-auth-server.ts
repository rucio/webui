import type { UserPassLoginAuthServerDTO } from '@/lib/core/dto/auth-server-dto';
import AuthServerGatewayOutputPort from '@/lib/core/port/secondary/auth-server-gateway-output-port';
import { injectable } from 'inversify';

/**
 * Provides an implementation of the {@link AuthServerGatewayOutputPort} interface.
 * It makes calls to the Rucio Auth Server.
 */
@injectable()
class RucioAuthServer implements AuthServerGatewayOutputPort {
    async userpassLogin(username: string, password: string, account: string, vo: string): Promise<UserPassLoginAuthServerDTO> {
        console.log('[LOGIN FLOW 10b] RucioAuthServer userpassLogin started', {
            username,
            account: account || '(none)',
            vo,
            authHost: process.env.RUCIO_AUTH_HOST,
        });

        const authHost = process.env.RUCIO_AUTH_HOST;
        const userpassEndpoint = '/auth/userpass';
        const url = authHost + userpassEndpoint;
        let response = null;
        let dto: UserPassLoginAuthServerDTO;

        try {
            if (account === undefined || account === null || account === '') {
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'X-Rucio-AppID': 'webui',
                        'X-Rucio-Username': username,
                        'X-Rucio-Password': password,
                        'X-Rucio-VO': vo,
                    },
                });
            } else {
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'X-Rucio-AppID': 'webui',
                        'X-Rucio-Username': username,
                        'X-Rucio-Password': password,
                        'X-Rucio-Account': account,
                        'X-Rucio-VO': vo,
                    },
                });
            }

            console.log('[LOGIN FLOW 10c] HTTP response received from auth server', {
                status: response?.status,
                hasAuthToken: !!response?.headers.get('X-Rucio-Auth-Token'),
                hasAccount: !!response?.headers.get('X-Rucio-Auth-Account'),
                hasMultipleAccounts: !!response?.headers.get('X-Rucio-Auth-Accounts'),
            });
        } catch (error: Error | any) {
            if (authHost === undefined || authHost === null || authHost === '') {
                dto = {
                    statusCode: 503,
                    message: 'Rucio Auth Server is not configured in the WebUI settings',
                    account: '',
                    authToken: '',
                    authTokenExpires: '',
                };
            } else {
                dto = {
                    statusCode: 500,
                    message: 'Rucio Auth Server error: fetch failed. Reason: ' + error.cause.message,
                    account: '',
                    authToken: '',
                    authTokenExpires: '',
                };
            }
            return Promise.resolve(dto);
        }
        if (!response) {
            dto = {
                statusCode: 502,
                message: 'Rucio Auth Server did not return a response',
                account: '',
                authToken: '',
                authTokenExpires: '',
            };
            return Promise.resolve(dto);
        }

        if (response.status === 401) {
            dto = {
                statusCode: response.status,
                message: 'Invalid credentials',
                account: '',
                authToken: '',
                authTokenExpires: '',
            };
            return Promise.resolve(dto);
        }

        if (response.status === 200) {
            console.log('[LOGIN FLOW 10d] Processing 200 response', {
                status: response.status,
            });

            const dto: UserPassLoginAuthServerDTO = {
                statusCode: response.status,
                message: '',
                account: '',
                authToken: '',
                authTokenExpires: '',
            };
            const authToken = response.headers.get('X-Rucio-Auth-Token');
            const account = response.headers.get('X-Rucio-Auth-Account');
            const authTokenExpires = response.headers.get('X-Rucio-Auth-Token-Expires');

            if (!authToken || !account || !authTokenExpires) {
                dto.message = 'Rucio Auth Server returned 200 but no auth token or account headers';
                dto.account = '';
                dto.authToken = '';
            } else {
                dto.authToken = authToken;
                dto.account = account;
                dto.authTokenExpires = authTokenExpires;
            }

            return Promise.resolve(dto);
        } else if (response.status === 206) {
            console.log('[LOGIN FLOW 10e] Processing 206 response (multiple accounts)', {
                status: response.status,
            });

            const multipleAccounts = response.headers.get('X-Rucio-Auth-Accounts');
            if (multipleAccounts === null) {
                throw new Error('Unable to extract available accounts from the response');
            }
            const dto: UserPassLoginAuthServerDTO = {
                statusCode: response.status,
                message: multipleAccounts,
                account: '',
                authToken: '',
                authTokenExpires: '',
            };
            return Promise.resolve(dto);
        } else {
            throw new Error('Unable to handle response from Rucio Auth Server');
        }
    }
}

export default RucioAuthServer;
