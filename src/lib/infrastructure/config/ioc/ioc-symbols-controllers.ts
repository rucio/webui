/**
 * /**
 * @file ioc-symbols-input-port.ts
 * @description This file contains the symbols for the controllers. Controllers are used
 * to execute the use cases.
 */
const CONTROLLERS = {
    USERPASS_LOGIN: Symbol.for("UserPassLoginController"),
    LOGIN_CONFIG: Symbol.for("LoginConfigController"),
    SET_X509_LOGIN_SESSION: Symbol.for("SetX509LoginSessionController"),
}

export default CONTROLLERS;
