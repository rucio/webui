import { SessionUser, User } from "@/lib/core/entity/auth-models"

/**
 * Represents the view model for the site header
 * @property activeAccount - The currently active account
 * @property availableAccounts - The list of available accounts
 * @property homeUrl - The URL to the home page or dashboard
 * @property projectUrl - The URL to the project page corresponding to a VO, Experiment or Community which is configured via ENV variables
 */
export type SiteHeaderViewModel = {
    activeAccount?: User
    availableAccounts?: User[]
    homeUrl: string
    projectUrl: string
}