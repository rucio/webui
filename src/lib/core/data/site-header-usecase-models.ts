import { User } from "../entity/auth-models"

/**
 * Response model for SiteHeaderUseCase {@link SiteHeaderUseCase}
 * @property {string} homeUrl - URL of the home page (dashboard)
 * @property {string} projectURL - URL of the experiment page
 */
export type SiteHeaderResponse = {
    homeUrl: string
    projectURL: string
    activeUser: User | null
    availableUsers: User[]
}

export type SiteHeaderError = {
    error: 'project-url-not-found' | 'no-active-user'
}