import { UserPassLoginAuthServerDTO } from "@/lib/core/data/auth-server-dto";
import AuthServerGatewayOutputPort from "@/lib/core/port/secondary/auth-server-gateway-output-port";
import { injectable } from "inversify";

/**
 * Provides an implementation of the {@link AuthServerGatewayOutputPort} interface.
 * It makes calls to the Rucio Auth Server.
 */
@injectable()
class RucioAuthServer implements AuthServerGatewayOutputPort {
    userpassLogin(username: string, password: string, account: string): Promise<UserPassLoginAuthServerDTO> {
        throw new Error("Method not implemented.");
    }
}

export default RucioAuthServer