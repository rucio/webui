import { SwitchAccountRequest } from "../../data/switch-account-usecase-models";

export default interface SwitchAccountInputPort {
    switchAccount(request: SwitchAccountRequest): Promise<void>
}