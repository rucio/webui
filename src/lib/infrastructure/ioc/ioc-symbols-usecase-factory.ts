/**
 * @file ioc-symbols-usecase-factory.ts
 * @description This file contains the symbols for the use case factories. 
 * Use case factories are used to create the use cases. 
 * They inject the response object into the presenter used by the use case.
 */
const USECASE_FACTORY = {
    DID_META: Symbol.for("Factory<DIDMetaUseCase>"),
    DID_KEYVALUEPAIRS: Symbol.for("Factory<DIDKeyValuePairsDataUseCase>"),
    GET_RSE: Symbol.for("Factory<GetRSEUseCase>"),
    GET_RSE_ATTRIBUTES: Symbol.for("Factory<GetRSEAttributesUseCase>"),
    GET_RSE_PROTOCOLS: Symbol.for("Factory<GetRSEProtocolsUseCase>"),
    GET_SUBSCRIPTION: Symbol.for("Factory<GetSubscriptionUseCase>"),
    LIST_ACCOUNT_RSE_QUOTAS: Symbol.for("Factory<ListAccountRSEQuotasUseCase>"),
    LIST_ALL_RSES: Symbol.for("Factory<ListAllRSEsUseCase>"),
    LIST_DIDS: Symbol.for("Factory<ListDIDsUseCase>"),
    LIST_DID_CONTENTS: Symbol.for("Factory<ListDIDContentsUseCase>"),
    LIST_DID_PARENTS: Symbol.for("Factory<ListDIDParentsUseCase>"),
    LIST_DID_RULES: Symbol.for("Factory<ListDIDRulesUseCase>"),
    LIST_DATASET_REPLICAS: Symbol.for("Factory<ListDatasetReplicasUseCase>"),
    LIST_FILE_REPLICAS: Symbol.for("Factory<ListFileReplicasUseCase>"),
    LIST_RSES: Symbol.for("Factory<ListRSEsUseCase>"),
    LIST_SUBSCRIPTIONS: Symbol.for("Factory<ListSubscriptionsUseCase>"),
    LIST_SUBSCRIPTION_RULE_STATES: Symbol.for("Factory<ListSubscriptionRuleStatesUseCase>"),
    LOGIN_CONFIG: Symbol.for("Factory<LoginConfigUseCase>"),
    SET_X509_LOGIN_SESSION: Symbol.for("Factory<SetX509LoginSessionUseCase>"),
    GET_SITE_HEADER: Symbol.for("Factory<SiteHeaderUseCase>"),
    STREAM: Symbol.for("Factory<StreamUseCase>"),
    SWITCH_ACCOUNT: Symbol.for("Factory<SwitchAccountUseCase>"),
    USERPASS_LOGIN: Symbol.for("Factory<UserPassLoginUseCase>"),

}

export default USECASE_FACTORY;