import { injectable } from "inversify";
import type LoginConfigInputPort from "../port/primary/login-config-input-port";
import type LoginConfigOutputPort from "../port/primary/login-config-output-port";
import type EnvConfigGatewayOutputPort from "../port/secondary/env-config-gateway-output-port";


@injectable()
class LoginConfigUseCase implements LoginConfigInputPort {
    
    constructor(
        private presenter: LoginConfigOutputPort<any>,
        private envConfigGateway: EnvConfigGatewayOutputPort,
    ){
        this.presenter = presenter;
        this.envConfigGateway = envConfigGateway;
    }
    execute(): void {
        const config = await Promise.all([
            this.envConfigGateway.
        ])
        
    }

}