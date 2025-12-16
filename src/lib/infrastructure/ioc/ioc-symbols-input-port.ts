/**
 * @file ioc-symbols-input-port.ts
 * @description This file contains the symbols for the input ports. Input ports are implemented by the use cases.
 */
const INPUT_PORT = {
    DID_META: Symbol.for('DIDMetaInputPort'),
    DID_KEYVALUEPAIRS: Symbol.for('DIDKeyValuePairsDataInputPort'),
    GET_ACCOUNT_INFO: Symbol.for('GetAccountInfoInputPort'),
    GET_RSE: Symbol.for('GetRSEInputPort'),
    GET_RSE_ATTRIBUTES: Symbol.for('GetRSEAttributesInputPort'),
    GET_RSE_PROTOCOLS: Symbol.for('GetRSEProtocolsInputPort'),
    GET_SUBSCRIPTION: Symbol.for('GetSubscriptionInputPort'),
    LIST_ACCOUNT_RSE_QUOTAS: Symbol.for('ListAccountRSEQuotasInputPort'),
    LIST_ALL_RSES: Symbol.for('ListAllRSEsInputPort'),
    LIST_DIDS: Symbol.for('ListDIDsInputPort'),
    LIST_DID_CONTENTS: Symbol.for('ListDIDContentsInputPort'),
    LIST_DID_PARENTS: Symbol.for('ListDIDParentsInputPort'),
    LIST_DID_RULES: Symbol.for('ListDIDRulesInputPort'),
    LIST_DATASET_REPLICAS: Symbol.for('ListDatasetReplicasInputPort'),
    LIST_FILE_REPLICAS: Symbol.for('ListFileReplicasInputPort'),
    LIST_RSES: Symbol.for('ListRSEsInputPort'),
    LIST_SUBSCRIPTIONS: Symbol.for('ListSubscriptionsInputPort'),
    LIST_SUBSCRIPTION_RULE_STATES: Symbol.for('ListSubscriptionRuleStatesInputPort'),
    LOGIN_CONFIG: Symbol.for('LoginConfigInputPort'),
    SET_X509_LOGIN_SESSION: Symbol.for('SetX509LoginSessionInputPort'),
    GET_SITE_HEADER: Symbol.for('SiteHeaderInputPort'),
    STREAM: Symbol.for('StreamInputPort'),
    TEST: Symbol.for('TestInputPort'),
    USERPASS_LOGIN: Symbol.for('UserPassLoginInputPort'),
    GET_RSE_USAGE: Symbol.for('GetRSEUsageInputPort'),
    LIST_RULES: Symbol.for('ListRulesInputPort'),
    LIST_ACCOUNT_RSE_USAGE: Symbol.for('ListAccountRSEUsageInputPort'),
    CREATE_RULE: Symbol.for('CreateRuleInputPort'),
    ADD_DID: Symbol.for('AddDIDInputPort'),
    ATTACH_DIDS: Symbol.for('AttachDIDsInputPort'),
    SET_DID_STATUS: Symbol.for('SetDIDStatusInputPort'),
    GET_RULE: Symbol.for('GetRuleInputPort'),
    LIST_RULE_REPLICA_LOCK_STATES: Symbol.for('ListRuleReplicaLockStatesInputPort'),
    GET_FTS_LINK: Symbol.for('GetFTSLinkInputPort'),
};

export default INPUT_PORT;
