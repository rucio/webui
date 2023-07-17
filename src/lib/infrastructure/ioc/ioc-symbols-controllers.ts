/**
 * /**
 * @file ioc-symbols-input-port.ts
 * @description This file contains the symbols for the controllers. Controllers are used
 * to execute the use cases.
 */
const CONTROLLERS = {
    DID_META: Symbol.for("DIDMetaController"),
    LOGIN_CONFIG: Symbol.for("LoginConfigController"),
    LIST_DIDS: Symbol.for("ListDIDsController"),
    SET_X509_LOGIN_SESSION: Symbol.for("SetX509LoginSessionController"),
    SITE_HEADER: Symbol.for("SiteHeaderController"),
    STREAM: Symbol.for("StreamController"),
    SWITCH_ACCOUNT: Symbol.for("SwitchAccountController"),
    USERPASS_LOGIN: Symbol.for("UserPassLoginController"),
}

export default CONTROLLERS;
