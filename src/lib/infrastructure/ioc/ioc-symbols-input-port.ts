/**
 * @file ioc-symbols-input-port.ts
 * @description This file contains the symbols for the input ports. Input ports are implemented by the use cases.
 */
const INPUT_PORT = {
    LOGIN_CONFIG: Symbol.for("LoginConfigInputPort"),
    LIST_DIDS: Symbol.for("ListDIDsInputPort"),
    SET_X509_LOGIN_SESSION: Symbol.for("SetX509LoginSessionInputPort"),
    SITE_HEADER: Symbol.for("SiteHeaderInputPort"),
    STREAM: Symbol.for("StreamInputPort"),
    SWITCH_ACCOUNT: Symbol.for("SwitchAccountInputPort"),
    TEST: Symbol.for("TestInputPort"),
    USERPASS_LOGIN: Symbol.for("UserPassLoginInputPort"),
}

export default INPUT_PORT;

// import fs from 'fs';
// import path from 'path';


// // Scan the ports directory for files
// const portFiles = fs.readdirSync(path.join(__dirname, '../../core/port/primary'));

// interface InputPort {
//     [key: string]: symbol;
// }

// const INPUT_PORT: InputPort = {};


// const getInputPorts = () => {
//     // console.log(`Registering input ports...${portFiles.length} found`)
//     // for (const file of portFiles) {
//     //     let refName = ''
//     //     if (file.includes('-ports.ts')) {
//     //         refName = file.replace('-ports.ts', '').replaceAll('-', '_').toUpperCase();
//     //     } else if (file.includes('-port.ts')) {
//     //         refName = file.replace('-input-port.ts', '').replaceAll('-', '_').toUpperCase();
//     //     }
//     //     const symbolName = `${refName}_INPUT_PORT`;
        
//     //     INPUT_PORT[refName] = Symbol.for(symbolName);
//     //     console.log(`Registered ${symbolName}`)
//     // }
//     // return INPUT_PORT;
// }
// export { INPUT_PORT, getInputPorts };
