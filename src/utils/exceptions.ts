import { CustomError } from 'ts-custom-error'

export class HttpError extends CustomError implements Error {
    protected static messages = {
        400: 'Bad Request',
        401: 'Unauthorized', // RFC 7235
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required', // RFC 7235
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed', // RFC 7232
        413: 'Payload Too Large', // RFC 7231
        414: 'URI Too Long', // RFC 7231
        415: 'Unsupported Media Type',
        416: 'Range Not Satisfiable', // RFC 7233
        417: 'Expectation Failed',
        418: "I'm a teapot", // RFC 2324
        421: 'Misdirected Request', // RFC 7540
        426: 'Upgrade Required',
        428: 'Precondition Required', // RFC 6585
        429: 'Too Many Requests', // RFC 6585
        431: 'Request Header Fields Too Large', // RFC 6585
        451: 'Unavailable For Legal Reasons', // RFC 7725
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        506: 'Variant Also Negotiates', // RFC 2295
        510: 'Not Extended', // RFC 2774
        511: 'Network Authentication Required', // RFC 6585
    }

    public constructor(public code: number, message: string) {
        super(message)
    }

    public static fromCode(code: number, message?: string) {
        return new HttpError(
            code,
            message ??
                HttpError.messages[code as keyof typeof HttpError.messages],
        )
    }
}

export class AuthError extends CustomError implements Error {
    protected static messages = {
        COMMON_LOGIN_FAILED: 'Login failed',
        OIDC_PROVIDER_NOT_FOUND: 'OIDC provider not found',
        USERPASS_NO_HEADER: 'No X-Rucio-Auth-Accounts header found in response',
    }

    public constructor(public type: string, message: string) {
        super(message)
    }

    public static fromType(type: string, message?: string) {
        return new AuthError(
            type,
            message ??
                AuthError.messages[type as keyof typeof AuthError.messages],
        )
    }
}
