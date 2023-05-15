/**
 * This file contains the symbols used to register the gateways in the IoC container.
 */
const GATEWAYS = {
    ACCOUNT: Symbol.for("RucioAccountGateway"),
    AUTH_SERVER: Symbol.for("RucioAuthServer"),
    ENV_CONFIG: Symbol.for("EnvConfigGateway"),
    STREAM: Symbol.for("StreamGateway"),
}

export default GATEWAYS;
