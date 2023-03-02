import EnvConfigGatewayOutputPort from "@/lib/core/port/secondary/env-config-gateway-output-port";
import { injectable } from "inversify";

@injectable()
class EnvConfigGateway implements EnvConfigGatewayOutputPort {
    get(key: string): Promise<string | undefined> {
        const value = process.env[key]
        return Promise.resolve(value)
    }
}

export default EnvConfigGateway