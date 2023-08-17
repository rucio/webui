/**
 * /**
 * @file ioc-symbols-input-port.ts
 * @description This file contains the symbols for the controllers. Controllers are used
 * to execute the use cases.
 */
const CONTROLLERS = {
    DID_META: Symbol.for("DIDMetaController"),
    GET_SUBSCRIPTION: Symbol.for("GetSubscriptionController"),
    LOGIN_CONFIG: Symbol.for("LoginConfigController"),
    LIST_DIDS: Symbol.for("ListDIDsController"),
    LIST_DID_RULES: Symbol.for("ListDIDRulesController"),
    LIST_SUBSCRIPTIONS: Symbol.for("ListSubscriptionsController"),
    SET_X509_LOGIN_SESSION: Symbol.for("SetX509LoginSessionController"),
    SITE_HEADER: Symbol.for("SiteHeaderController"),
    STREAM: Symbol.for("StreamController"),
    SWITCH_ACCOUNT: Symbol.for("SwitchAccountController"),
    USERPASS_LOGIN: Symbol.for("UserPassLoginController"),
}

export default CONTROLLERS;
