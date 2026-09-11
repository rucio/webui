import 'reflect-metadata';

import { ListOpenDataDIDsDTO, OpenDataDIDDTO } from '@/lib/core/dto/opendata-dto';
import ListOpenDataDIDsUseCase from '@/lib/core/use-case/list-opendata-dids-usecase';
import OpenDataDIDUseCase from '@/lib/core/use-case/opendata-did-usecase';
import { ListOpenDataDIDsRequest } from '@/lib/core/usecase-models/list-opendata-dids-usecase-models';
import { OpenDataDIDRequest } from '@/lib/core/usecase-models/opendata-did-usecase-models';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

const openDataDIDUseCase = Object.create(OpenDataDIDUseCase.prototype) as OpenDataDIDUseCase;

const listOpenDataDIDsUseCase = Object.create(ListOpenDataDIDsUseCase.prototype) as ListOpenDataDIDsUseCase;

const makeOpenDataErrorDTO = (errorCode: number): OpenDataDIDDTO => ({
    status: 'error',
    scope: '',
    name: '',
    files: [],
    meta: {},
    errorCode,
    errorName: 'Gateway Error',
    errorMessage: 'Request failed',
});

const makeListErrorDTO = (errorCode: number): ListOpenDataDIDsDTO => ({
    status: 'error',
    total: 0,
    offset: 0,
    dids: [],
    errorCode,
    errorName: 'Gateway Error',
    errorMessage: 'Request failed',
});

describe('OpenDataDIDUseCase', () => {
    describe('request validation', () => {
        it('rejects a missing scope', () => {
            const request = {
                scope: '',
                did: 'dataset',
                rucioAuthToken: 'token',
            } as AuthenticatedRequestModel<OpenDataDIDRequest>;

            const result = openDataDIDUseCase.validateRequestModel(request);

            expect(result).toEqual({
                status: 'error',
                code: 400,
                name: 'Invalid Request',
                error: 'INVALID_REQUEST',
                message: 'Scope is required',
            });
        });

        it('rejects a missing DID', () => {
            const request = {
                scope: 'mock',
                did: '',
                rucioAuthToken: 'token',
            } as AuthenticatedRequestModel<OpenDataDIDRequest>;

            const result = openDataDIDUseCase.validateRequestModel(request);

            expect(result).toEqual({
                status: 'error',
                code: 400,
                name: 'Invalid Request',
                error: 'INVALID_REQUEST',
                message: 'DID is required',
            });
        });

        it('rejects a missing authentication token', () => {
            const request = {
                scope: 'mock',
                did: 'dataset',
                rucioAuthToken: '',
            } as AuthenticatedRequestModel<OpenDataDIDRequest>;

            const result = openDataDIDUseCase.validateRequestModel(request);

            expect(result).toEqual({
                status: 'error',
                code: 401,
                name: 'Authentication Error',
                error: 'INVALID_AUTH',
                message: 'Auth token is required',
            });
        });

        it('accepts a valid request', () => {
            const request = {
                scope: 'mock',
                did: 'dataset',
                rucioAuthToken: 'token',
            } as AuthenticatedRequestModel<OpenDataDIDRequest>;

            expect(openDataDIDUseCase.validateRequestModel(request)).toBeUndefined();
        });
    });

    describe('gateway error handling', () => {
        it.each([
            [400, 'INVALID_REQUEST'],
            [401, 'INVALID_AUTH'],
            [403, 'INVALID_AUTH'],
            [404, 'NOT_FOUND'],
            [500, 'UNKNOWN_ERROR'],
        ] as const)('maps gateway HTTP %i to %s', (errorCode, expectedError) => {
            const result = openDataDIDUseCase.handleGatewayError(makeOpenDataErrorDTO(errorCode));

            expect(result).toEqual({
                status: 'error',
                code: errorCode,
                name: 'Gateway Error',
                error: expectedError,
                message: 'Request failed',
            });
        });

        it('uses fallback values when gateway error details are missing', () => {
            const dto: OpenDataDIDDTO = {
                status: 'error',
                scope: '',
                name: '',
                files: [],
                meta: {},
            };

            const result = openDataDIDUseCase.handleGatewayError(dto);

            expect(result).toEqual({
                status: 'error',
                code: 500,
                name: 'Gateway Error',
                error: 'UNKNOWN_ERROR',
                message: 'Unknown error',
            });
        });
    });
});

describe('ListOpenDataDIDsUseCase', () => {
    describe('request validation', () => {
        it('rejects a missing authentication token', () => {
            const request = {
                rucioAuthToken: '',
            } as AuthenticatedRequestModel<ListOpenDataDIDsRequest>;

            const result = listOpenDataDIDsUseCase.validateRequestModel(request);

            expect(result).toEqual({
                status: 'error',
                code: 401,
                name: 'Authentication Error',
                error: 'INVALID_AUTH',
                message: 'Auth token is required',
            });
        });

        it.each([0, -1, 1.5])('rejects invalid limit %s', limit => {
            const request = {
                rucioAuthToken: 'token',
                limit,
            } as AuthenticatedRequestModel<ListOpenDataDIDsRequest>;

            const result = listOpenDataDIDsUseCase.validateRequestModel(request);

            expect(result).toEqual({
                status: 'error',
                code: 400,
                name: 'Invalid Request',
                error: 'INVALID_REQUEST',
                message: 'Limit must be a positive integer',
            });
        });

        it.each([-1, 1.5])('rejects invalid offset %s', offset => {
            const request = {
                rucioAuthToken: 'token',
                offset,
            } as AuthenticatedRequestModel<ListOpenDataDIDsRequest>;

            const result = listOpenDataDIDsUseCase.validateRequestModel(request);

            expect(result).toEqual({
                status: 'error',
                code: 400,
                name: 'Invalid Request',
                error: 'INVALID_REQUEST',
                message: 'Offset must be a non-negative integer',
            });
        });

        it('accepts limit 1 and offset 0', () => {
            const request = {
                rucioAuthToken: 'token',
                limit: 1,
                offset: 0,
            } as AuthenticatedRequestModel<ListOpenDataDIDsRequest>;

            expect(listOpenDataDIDsUseCase.validateRequestModel(request)).toBeUndefined();
        });

        it('accepts a request without optional pagination parameters', () => {
            const request = {
                rucioAuthToken: 'token',
            } as AuthenticatedRequestModel<ListOpenDataDIDsRequest>;

            expect(listOpenDataDIDsUseCase.validateRequestModel(request)).toBeUndefined();
        });
    });

    describe('gateway error handling', () => {
        it.each([
            [400, 'INVALID_REQUEST'],
            [401, 'INVALID_AUTH'],
            [403, 'INVALID_AUTH'],
            [404, 'NOT_FOUND'],
            [500, 'UNKNOWN_ERROR'],
        ] as const)('maps gateway HTTP %i to %s', (errorCode, expectedError) => {
            const result = listOpenDataDIDsUseCase.handleGatewayError(makeListErrorDTO(errorCode));

            expect(result).toEqual({
                status: 'error',
                code: errorCode,
                name: 'Gateway Error',
                error: expectedError,
                message: 'Request failed',
            });
        });

        it('maps opendata_unsupported to FEATURE_UNSUPPORTED', () => {
            const dto: ListOpenDataDIDsDTO = {
                status: 'error',
                total: 0,
                offset: 0,
                dids: [],
                errorCode: 404,
                errorName: 'OpenData Unsupported',
                errorType: 'opendata_unsupported',
                errorMessage: 'OpenData is not supported by this Rucio server.',
            };

            const result = listOpenDataDIDsUseCase.handleGatewayError(dto);

            expect(result).toEqual({
                status: 'error',
                code: 404,
                name: 'OpenData Unsupported',
                error: 'FEATURE_UNSUPPORTED',
                message: 'OpenData is not supported by this Rucio server.',
            });
        });

        it('uses fallback values when gateway error details are missing', () => {
            const dto: ListOpenDataDIDsDTO = {
                status: 'error',
                total: 0,
                offset: 0,
                dids: [],
            };

            const result = listOpenDataDIDsUseCase.handleGatewayError(dto);

            expect(result).toEqual({
                status: 'error',
                code: 500,
                name: 'Gateway Error',
                error: 'UNKNOWN_ERROR',
                message: 'Unknown error',
            });
        });
    });
});
