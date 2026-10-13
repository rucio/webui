import { handleCommonGatewayErrors } from '@/lib/sdk/usecase';
import { BaseDTO } from '@/lib/sdk/dto';

describe('handleCommonGatewayErrors', () => {
    const base: BaseDTO = {
        status: 'error',
        errorType: 'gateway_endpoint_error',
        errorCode: 401,
        errorMessage: 'nope',
        errorName: 'Invalid Auth Token',
    };

    it('uses the Rucio ExceptionClass as name when present', () => {
        expect(handleCommonGatewayErrors({ ...base, errorClass: 'AccessDenied' })).toMatchObject({
            code: 401,
            name: 'AccessDenied',
            message: 'nope',
        });
    });

    it('falls back to errorName without an ExceptionClass', () => {
        expect(handleCommonGatewayErrors(base)).toMatchObject({ name: 'Invalid Auth Token' });
    });

    it('ignores errors that are not gateway endpoint errors', () => {
        expect(handleCommonGatewayErrors({ ...base, errorType: 'other' })).toBeUndefined();
    });
});
