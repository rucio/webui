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
}

export interface GetSiteHeaderError extends BaseErrorResponseModel, Omit<GetSiteHeaderResponse, 'status'> {
    error: 'project-url-not-found' | 'no-active-user';
}
