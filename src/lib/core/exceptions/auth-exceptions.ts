export class AuthError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "AuthError"
    }
}

export class RucioTokenExpiredError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "RucioTokenExpiredError"
    }
}