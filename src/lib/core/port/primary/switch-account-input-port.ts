import { IronSession } from "iron-session";
import { SwitchAccountRequest } from "../../usecase-models/switch-account-usecase-models";

/**
 * Provides an interface for the {@link SwitchAccountUseCase}.
 */
export default interface SwitchAccountInputPort {
    /**
     * This function breaks the clean architecture, but it is necessary to do so in this case.
     * @param request {@link SwitchAccountRequest}
     * @param session The IronSession object
     */
    switchAccount(request: SwitchAccountRequest, session: IronSession): Promise<void>
}