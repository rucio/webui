import { SiteHeaderError, SiteHeaderResponse } from "@/lib/core/data/site-header-usecase-models";
import SiteHeaderOutputPort from "@/lib/core/port/primary/site-header-output-port";
import { NextApiResponse } from "next";
import { SiteHeaderViewModel } from "../data/view-model/site-header";

/**
 * Provides an implementation of the {@link SiteHeaderOutputPort} interface.
 */
export default class SiteHeaderPresenter implements SiteHeaderOutputPort<NextApiResponse> {
    response: NextApiResponse<any>;
    
    constructor(response: NextApiResponse) {
        this.response = response;
    }

    async presentSuccess(responseModel: SiteHeaderResponse): Promise<void> {
        const projectUrl = responseModel.projectURL? responseModel.projectURL : '';
        
        const viewModel: SiteHeaderViewModel = {
            activeAccount: responseModel.activeUser || undefined,
            availableAccounts: responseModel.availableUsers || [],
            homeUrl: responseModel.homeUrl,
            projectUrl: projectUrl
        }
        
        this.response.status(200).json(viewModel);
    }

    async presentError(errorModel: SiteHeaderError): Promise<void> {
        if (errorModel.error === 'project-url-not-found') {
            this.response.status(500).json(errorModel);
            return;
        }
        if (errorModel.error === 'no-active-user') {
            this.response.status(418).json(errorModel);
            return;
        }
    }
    
}