import { GetSiteHeaderError, GetSiteHeaderResponse } from '@/lib/core/usecase-models/get-site-header-usecase-models';
import { GetSiteHeaderOutputPort } from '@/lib/core/port/primary/get-site-header-ports';
import { SiteHeaderViewModel } from '../data/view-model/site-header';
import { BasePresenter } from '@/lib/sdk/presenter';

/**
 * Provides an implementation of the {@link GetSiteHeaderOutputPort} interface.
 */
export default class GetSiteHeaderPresenter extends BasePresenter<GetSiteHeaderResponse, GetSiteHeaderError, SiteHeaderViewModel> {
    convertResponseModelToViewModel(responseModel: GetSiteHeaderResponse): { viewModel: SiteHeaderViewModel; status: number } {
        const projectUrl = responseModel.projectURL ? responseModel.projectURL : '';

        const viewModel: SiteHeaderViewModel = {
            status: 'success',
            activeAccount: responseModel.activeUser || undefined,
            availableAccounts: responseModel.availableUsers || [],
            homeUrl: responseModel.homeUrl,
            projectUrl: projectUrl,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }
    convertErrorModelToViewModel(errorModel: GetSiteHeaderError): { viewModel: SiteHeaderViewModel; status: number } {
        let status = 500;
        if (errorModel.error === 'no-active-user') {
            status = 418;
        }
        const viewModel: SiteHeaderViewModel = {
            status: 'error',
            message: errorModel.error,
            activeAccount: errorModel.activeUser || undefined,
            availableAccounts: errorModel.availableUsers || [],
            homeUrl: errorModel.homeUrl,
            projectUrl: errorModel.projectURL || undefined,
        };
        return {
            status: status,
            viewModel: viewModel,
        };
    }
}
