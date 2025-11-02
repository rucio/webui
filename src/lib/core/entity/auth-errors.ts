/**
 * Authentication Error Types and Messages
 * Maps backend error types to user-friendly messages
 */

export type AuthErrorType =
    | 'INVALID_CREDENTIALS'
    | 'ACCOUNT_NOT_FOUND'
    | 'MULTIPLE_ACCOUNTS'
    | 'SERVER_ERROR'
    | 'NETWORK_ERROR'
    | 'UNAUTHORIZED'
    | 'UNKNOWN_ERROR';

export interface AuthError {
    type: AuthErrorType;
    message: string;
    details?: string;
}

/**
 * User-friendly error messages for authentication errors
 */
export const AUTH_ERROR_MESSAGES: Record<AuthErrorType, string> = {
    INVALID_CREDENTIALS: 'Invalid username or password. Please check your credentials and try again.',
    ACCOUNT_NOT_FOUND: 'Account not found. Please verify your account name.',
    MULTIPLE_ACCOUNTS: 'Multiple accounts are associated with these credentials. Please select an account.',
    SERVER_ERROR: 'Server error occurred. Please try again later or contact support.',
    NETWORK_ERROR: 'Network connection error. Please check your internet connection and try again.',
    UNAUTHORIZED: 'Authentication failed. You do not have permission to access this resource.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

/**
 * Maps NextAuth error codes to AuthErrorType
 */
export function mapNextAuthErrorToType(errorCode: string | null | undefined): AuthErrorType {
    if (!errorCode) return 'UNKNOWN_ERROR';

    // NextAuth error codes mapping
    switch (errorCode) {
        case 'CredentialsSignin':
            return 'INVALID_CREDENTIALS';
        case 'AccessDenied':
            return 'UNAUTHORIZED';
        case 'Configuration':
        case 'OAuthCallback':
        case 'OAuthSignin':
            return 'SERVER_ERROR';
        default:
            return 'UNKNOWN_ERROR';
    }
}

/**
 * Gets user-friendly error message for an error type
 */
export function getAuthErrorMessage(errorType: AuthErrorType): string {
    return AUTH_ERROR_MESSAGES[errorType] || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Custom error type for multiple accounts scenario
 * This will be thrown so NextAuth can return it to the frontend
 */
export class MultipleAccountsError extends Error {
    availableAccounts: string;
    constructor(accounts: string) {
        super('Multiple accounts available');
        this.name = 'MultipleAccountsError';
        this.availableAccounts = accounts;
    }
}

/**
 * Custom error type for login failures
 * Contains detailed error information to be displayed to the user
 */
export class LoginError extends Error {
    type: string;
    details?: string;

    constructor(type: string, message: string, details?: string) {
        super(message);
        this.name = 'LoginError';
        this.type = type;
        this.details = details;
    }
}

/**
 * Extracts error details from various error sources
 */
export function extractAuthError(error: any): AuthError {
    // If it's already an AuthError
    if (error?.type && error?.message) {
        return {
            type: error.type as AuthErrorType,
            message: error.message,
            details: error.details,
        };
    }

    // If it's a NextAuth error
    if (typeof error === 'string') {
        const type = mapNextAuthErrorToType(error);
        return {
            type,
            message: getAuthErrorMessage(type),
        };
    }

    // If it's an Error object
    if (error instanceof Error) {
        return {
            type: 'UNKNOWN_ERROR',
            message: error.message || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR,
        };
    }

    // Fallback
    return {
        type: 'UNKNOWN_ERROR',
        message: AUTH_ERROR_MESSAGES.UNKNOWN_ERROR,
    };
}
