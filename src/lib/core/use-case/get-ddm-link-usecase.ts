import { injectable } from 'inversify';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { GetDDMLinkRequest, GetDDMLinkResponse } from '@/lib/core/usecase-models/get-ddm-link-usecase-models';
import { GetDDMLinkInputPort, type GetDDMLinkOutputPort } from '@/lib/core/port/primary/get-ddm-link-ports';
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { createDDMDashboardUrl } from '@/lib/core/utils/ddm-link-utils';

@injectable()
export default class GetDDMLinkUseCase implements GetDDMLinkInputPort {
    constructor(
        private readonly presenter: GetDDMLinkOutputPort,
        private readonly envConfigGateway: EnvConfigGatewayOutputPort,
    ) {}

    async execute(requestModel: AuthenticatedRequestModel<GetDDMLinkRequest>): Promise<void> {
        const { scope, name, rse } = requestModel;

        const featureFlag = await this.envConfigGateway.get('FEATURE_DDM_DASHBOARD');
        if (!featureFlag || featureFlag.toLowerCase() !== 'true') {
            await this.presenter.presentError({
                status: 'error',
                message: 'DDM Dashboard feature is disabled',
                name: 'FeatureDisabledError',
                type: 'FeatureDisabledError',
                code: 403,
            });
            return;
        }

        const baseUrl = await this.envConfigGateway.get('DDM_DASHBOARD_BASE_URL');
        if (!baseUrl || baseUrl.trim() === '') {
            await this.presenter.presentError({
                status: 'error',
                message: 'DDM Dashboard base URL is not configured',
                name: 'ConfigNotFoundError',
                type: 'ConfigNotFoundError',
                code: 500,
            });
            return;
        }

        const url = createDDMDashboardUrl(baseUrl, scope, name, rse);

        const responseModel: GetDDMLinkResponse = {
            status: 'success',
            url,
        };
        await this.presenter.presentSuccess(responseModel);
    }
}
