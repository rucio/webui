/**
 * /**
 * @file ioc-symbols-input-port.ts
 * @description This file contains the symbols for the controllers. Controllers are used
 * to execute the use cases.
 */
const CONTROLLERS = {
    DID_META: Symbol.for("DIDMetaController"),
    DID_KEYVALUEPAIRS: Symbol.for("DIDKeyValuePairsDataController"),
    GET_ACCOUNT_INFO: Symbol.for("GetAccountInfoController"),
    GET_RSE: Symbol.for("GetRSEController"),
    GET_RSE_ATTRIBUTES: Symbol.for("GetRSEAttributesController"),
    GET_RSE_PROTOCOLS: Symbol.for("GetRSEProtocolsController"),
    GET_SUBSCRIPTION: Symbol.for("GetSubscriptionController"),
    LIST_ACCOUNT_RSE_QUOTAS: Symbol.for("ListAccountRSEQuotasController"),
    LIST_ALL_RSES: Symbol.for("ListAllRSEsController"),
    LIST_DIDS: Symbol.for("ListDIDsController"),
    LIST_DID_CONTENTS: Symbol.for("ListDIDContentsController"),
    LIST_DID_PARENTS: Symbol.for("ListDIDParentsController"),
    LIST_DID_RULES: Symbol.for("ListDIDRulesController"),
    LIST_DATASET_REPLICAS: Symbol.for("ListDatasetReplicasController"),
    LIST_FILE_REPLICAS: Symbol.for("ListFileReplicasController"),
    LIST_RSES: Symbol.for("ListRSEsController"),
    LIST_SUBSCRIPTIONS: Symbol.for("ListSubscriptionsController"),
    LIST_SUBSCRIPTION_RULE_STATES: Symbol.for("ListSubscriptionRuleStatesController"),
    LOGIN_CONFIG: Symbol.for("LoginConfigController"),
    SET_X509_LOGIN_SESSION: Symbol.for("SetX509LoginSessionController"),
    GET_SITE_HEADER: Symbol.for("SiteHeaderController"),
    STREAM: Symbol.for("StreamController"),
    SWITCH_ACCOUNT: Symbol.for("SwitchAccountController"),
    USERPASS_LOGIN: Symbol.for("UserPassLoginController"),
}

export default CONTROLLERS;
