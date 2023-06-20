import { User } from "../entity/auth-models"

/**
 * Response model for SiteHeaderUseCase {@link SiteHeaderUseCase}
 * @property {string} homeUrl - URL of the home page (dashboard)
 * @property {string} projectURL - URL of the experiment page
 */
export interface SiteHeaderResponse{
    homeUrl: string
    projectURL?: string
    activeUser: User | undefined
    availableUsers: User[]
}

export interface SiteHeaderError extends SiteHeaderResponse {
    error: 'project-url-not-found' | 'no-active-user'
}