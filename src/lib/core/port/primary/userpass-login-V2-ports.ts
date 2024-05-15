import { BaseAuthenticatedInputPort, BaseOutputPort } from "@/lib/sdk/primary-ports";
import { UserpassLoginV2Error, UserpassLoginV2Request, UserpassLoginV2Response } from "@/lib/core/usecase-models/userpass-login-V2-usecase-models";

/**
 * @interface UserpassLoginV2InputPort representing the UserpassLoginV2 usecase.
 */
export interface UserpassLoginV2InputPort extends BaseAuthenticatedInputPort<UserpassLoginV2Request> { }

/**
 * @interface UserpassLoginV2OutputPort representing the UserpassLoginV2 presenter.
 */
export interface UserpassLoginV2OutputPort extends BaseOutputPort<UserpassLoginV2Response, UserpassLoginV2Error> { }
