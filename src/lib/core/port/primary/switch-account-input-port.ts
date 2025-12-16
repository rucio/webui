import { RucioSession } from '@/lib/infrastructure/auth/session';
import { SwitchAccountRequest } from '../../usecase-models/switch-account-usecase-models';

/**
 * Provides an interface for the {@link SwitchAccountUseCase}.
 */
export default interface SwitchAccountInputPort {
    /**
     * This function breaks the clean architecture, but it is necessary to do so in this case.
     * @param request {@link SwitchAccountRequest}
     * @param session The RucioSession object
     */
    switchAccount(request: SwitchAccountRequest, session: RucioSession): Promise<void>;
}
