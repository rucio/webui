import { UserPassLoginAuthServerDTO } from "@/lib/core/data/auth-server-dto";
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
        try {
            response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Rucio-AppID': 'webui',
                'X-Rucio-Script': 'webui::auth-gateway',
                'X-Rucio-Username': username,
                'X-Rucio-Password': password,
            }
        })
        } catch (error) {
            console.log(error)
        }
        if(!response){
            throw new Error('Should return a error responseDTO here')
        }
        if(response.status === 200) {
            const json = await response.json()
            return json
        } else {
            throw new Error('Auth Server Error')
        }
    }
}

export default RucioAuthServer