/**
 * This file contains the symbols used to register the gateways in the IoC container.
 */
const GATEWAYS = {
    AUTH_SERVER: Symbol.for("RucioAuthServer"),
    ENV_CONFIG: Symbol.for("EnvConfigGateway"),
}

export default GATEWAYS;
