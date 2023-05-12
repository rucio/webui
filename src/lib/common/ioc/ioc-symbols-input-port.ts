/**
 * @file ioc-symbols-input-port.ts
 * @description This file contains the symbols for the input ports. Input ports are implemented by the use cases.
 */
const INPUT_PORT = {
    LOGIN_CONFIG: Symbol.for("LoginConfigInputPort"),
    SET_X509_LOGIN_SESSION: Symbol.for("SetX509LoginSessionInputPort"),
    SITE_HEADER: Symbol.for("SiteHeaderInputPort"),
    STREAM: Symbol.for("StreamInputPort"),
    TEST: Symbol.for("TestInputPort"),
    USERPASS_LOGIN: Symbol.for("UserPassLoginInputPort"),
}

export default INPUT_PORT;
