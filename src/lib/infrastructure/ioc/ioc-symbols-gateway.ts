/**
 * This file contains the symbols used to register the gateways in the IoC container.
 */
const GATEWAYS = {
    ACCOUNT: Symbol.for('RucioAccountGateway'),
    AUTH_SERVER: Symbol.for('RucioAuthServer'),
    DID: Symbol.for('RucioDIDGateway'),
    ENV_CONFIG: Symbol.for('EnvConfigGateway'),
    RSE: Symbol.for('RSEGateway'),
    STREAM: Symbol.for('StreamGateway'),
    SUBSCRIPTION: Symbol.for('SubscriptionGateway'),
    REPLICA: Symbol.for('ReplicaGateway'),
    RULE: Symbol.for('RuleGateway'),
};

export default GATEWAYS;
