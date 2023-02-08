/**
 * @file ioc-symbols-usecase-factory.ts
 * @description This file contains the symbols for the use case factories. 
 * Use case factories are used to create the use cases. 
 * They inject the response object into the presenter used by the use case.
 */
const USECASE_FACTORY = {
    USERPASS_LOGIN: Symbol.for("Factory<UserPassLoginUseCase>"),
}

export default USECASE_FACTORY;