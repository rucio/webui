import { SwitchAccountError, SwitchAccountResponse } from "../../usecase-models/switch-account-usecase-models";

export default interface SwitchAccountOutputPort<T>{
    response: T;
    presentSuccess(responseModel: SwitchAccountResponse): Promise<void>;
    presentError(error: SwitchAccountError): Promise<void>;
}