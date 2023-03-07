/**
 * @file ioc-symbols-input-port.ts
 * @description This file contains the symbols for the input ports. Input ports are implemented by the use cases.
 */
const INPUT_PORT = {
    USERPASS_LOGIN: Symbol.for("UserPassLoginInputPort"),
    LOGIN_CONFIG: Symbol.for("LoginConfigInputPort"),
    SET_X509_LOGIN_SESSION: Symbol.for("SetX509LoginSessionInputPort"),
    TEST: Symbol.for("TestInputPort")
}

export default INPUT_PORT;
