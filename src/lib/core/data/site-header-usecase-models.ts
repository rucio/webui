/**
 * Response model for SiteHeaderUseCase {@link SiteHeaderUseCase}
 * @property {string} homeUrl - URL of the home page (dashboard)
 * @property {string} experimentUrl - URL of the experiment page
 * @property {string | null} error - Error message if any
 */
export type SiteHeaderResponse = {
    homeUrl: string
    experimentUrl: string
    error: string | null
}
