import { injectable } from 'inversify';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { GetDDMLinkRequest, GetDDMLinkResponse } from '@/lib/core/usecase-models/get-ddm-link-usecase-models';
import { GetDDMLinkInputPort, type GetDDMLinkOutputPort } from '@/lib/core/port/primary/get-ddm-link-ports';
import type { ConfigReader, DDMDashboardSettings } from '@/lib/core/entity/app-config';
import { createDDMDashboardUrl } from '@/lib/core/utils/ddm-link-utils';

@injectable()
export default class GetDDMLinkUseCase implements GetDDMLinkInputPort {
    constructor(private readonly presenter: GetDDMLinkOutputPort, private readonly ddmDashboard: ConfigReader<DDMDashboardSettings>) {}

    async execute(requestModel: AuthenticatedRequestModel<GetDDMLinkRequest>): Promise<void> {
        const { scope, name, rse } = requestModel;

        const { enabled, baseUrl } = this.ddmDashboard();
        if (!enabled) {
            await this.presenter.presentError({
                status: 'error',
                message: 'DDM Dashboard feature is disabled',
                name: 'FeatureDisabledError',
                type: 'FeatureDisabledError',
                code: 403,
            });
            return;
        }

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
