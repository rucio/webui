/**
 * @file ioc-symbols-usecase-factory.ts
 * @description This file contains the symbols for the use case factories. 
 * Use case factories are used to create the use cases. 
 * They inject the response object into the presenter used by the use case.
 */
const USECASE_FACTORY = {
    DID_META: Symbol.for("Factory<DIDMetaUseCase>"),
    GET_SUBSCRIPTION: Symbol.for("Factory<GetSubscriptionUseCase>"),
    LOGIN_CONFIG: Symbol.for("Factory<LoginConfigUseCase>"),
    LIST_DIDS: Symbol.for("Factory<ListDIDsUseCase>"),
    SET_X509_LOGIN_SESSION: Symbol.for("Factory<SetX509LoginSessionUseCase>"),
    SITE_HEADER: Symbol.for("Factory<SiteHeaderUseCase>"),
    STREAM: Symbol.for("Factory<StreamUseCase>"),
    SWITCH_ACCOUNT: Symbol.for("Factory<SwitchAccountUseCase>"),
    USERPASS_LOGIN: Symbol.for("Factory<UserPassLoginUseCase>"),

}

export default USECASE_FACTORY;