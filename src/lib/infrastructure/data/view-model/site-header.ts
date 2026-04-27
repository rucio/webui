import { SessionUser, User } from '@/lib/core/entity/auth-models';
import { BaseViewModel } from '@/lib/sdk/view-models';

/**
 * Represents the view model for the site header
 * @property activeAccount - The currently active account
 * @property availableAccounts - The list of available accounts
 * @property homeUrl - The URL to the home page or dashboard
 * @property projectUrl - The URL to the project page corresponding to a VO, Experiment or Community which is configured via ENV variables
 */
export interface SiteHeaderViewModel extends BaseViewModel {
    activeAccount?: User;
    availableAccounts?: User[];
    /**
     * Names of accounts mapped to the active user's Rucio identity that aren't
     * already in availableAccounts; i.e. switchable but no live token in
     * session (#628 lazy-mint design). Userpass switches need a re-auth modal;
     * x509 switches re-fetch via the browser cert silently.
     */
    linkedAccountNames?: string[];
    /** Rucio auth host URL; for the client-side x509 switch flow (#628). */
    rucioAuthHost?: string;
    homeUrl: string;
    projectUrl?: string;
}
