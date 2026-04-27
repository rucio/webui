import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { RucioSession } from '@/lib/infrastructure/auth/session';
import { User } from '../entity/auth-models';

export interface GetSiteHeaderRequest {
    session: RucioSession;
}

/**
 * Response model for SiteHeaderUseCase {@link GetSiteHeaderUseCase}
 * @property {string} homeUrl - URL of the home page (dashboard)
 * @property {string} projectURL - URL of the experiment page
 */
export interface GetSiteHeaderResponse extends BaseResponseModel {
    homeUrl: string;
    projectURL?: string;
    activeUser: User | undefined;
    availableUsers: User[];
    /**
     * Names of accounts mapped to the active user's identity that are NOT
     * currently in availableUsers — i.e. the user *can* switch into them but
     * has no live token (#628 lazy-mint design). The dropdown surfaces these
     * with a re-auth modal trigger rather than a one-click switch.
     */
    linkedAccountNames: string[];
}

export interface GetSiteHeaderError extends BaseErrorResponseModel, Omit<GetSiteHeaderResponse, 'status'> {
    error: 'project-url-not-found' | 'no-active-user';
}
