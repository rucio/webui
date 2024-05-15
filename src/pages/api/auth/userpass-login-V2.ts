import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { UserpassLoginV2ControllerParameters } from "@/lib/infrastructure/controller/userpass-login-V2-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import { UserpassLoginV2Request } from "@/lib/core/usecase-models/userpass-login-V2-usecase-models";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";


async function userpassLoginV2(req: NextApiRequest, res: NextApiResponse){

    const UserpassV2controller = appContainer.get<BaseController<UserpassLoginV2ControllerParameters, UserpassLoginV2Request>>(CONTROLLERS.USERPASS_LOGIN_V2)
    const redirectTo = '/dashboard'
    const { username, password, account, vo } = req.body
    const controllerParameters: UserpassLoginV2ControllerParameters = {
        response: res,
        username: username,
        password: password,
        vo: vo,
        account: account,
        redirectTo: redirectTo,
        session: req.session,
    }
    await UserpassV2controller.execute(controllerParameters);

}

export default withSessionRoute(userpassLoginV2)

