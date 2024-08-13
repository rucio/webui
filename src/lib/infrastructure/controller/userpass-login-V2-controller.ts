import { injectable, inject } from "inversify";
import { NextApiResponse } from "next";
import { BaseController, TSimpleControllerParameters } from "@/lib/sdk/controller";
import { UserpassLoginV2Request } from "@/lib/core/usecase-models/userpass-login-V2-usecase-models";
import { UserpassLoginV2InputPort } from "@/lib/core/port/primary/userpass-login-V2-ports";
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory";
import { IronSession } from "iron-session";

export type UserpassLoginV2ControllerParameters = TSimpleControllerParameters & {
  username: string
  password: string
  vo: string
  account?: string
  redirectTo?: string
}

@injectable()
class UserpassLoginV2Controller extends BaseController<UserpassLoginV2ControllerParameters, UserpassLoginV2Request> {
  public constructor(
    @inject(USECASE_FACTORY.USERPASS_LOGIN_V2) useCaseFactory: (response: NextApiResponse, session?: IronSession) => UserpassLoginV2InputPort,
  ) {
    super(useCaseFactory)
  }
  prepareRequestModel(parameters: UserpassLoginV2ControllerParameters): UserpassLoginV2Request {
    return {
      username: parameters.username,
      password: parameters.password,
      vo: parameters.vo,
      account: parameters.account,
      redirectTo: parameters.redirectTo,
    } as UserpassLoginV2Request
  }
}

export default UserpassLoginV2Controller;


