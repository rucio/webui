/**
 * This file contains the symbols used to register the gateways in the IoC container.
 */
const GATEWAYS = {
    AUTH_SERVER: Symbol.for("RucioAuthServer"),
}

export default GATEWAYS;
