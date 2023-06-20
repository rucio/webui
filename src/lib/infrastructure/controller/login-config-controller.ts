import { inject, injectable } from "inversify";
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory";
import { BaseController, TSimpleControllerParameters } from "@/lib/sdk/controller";
import type TUseCaseFactory from "@/lib/sdk/usecase-factory";

export type LoginConfigControllerParams = TSimpleControllerParameters

@injectable()
class LoginConfigController extends BaseController<LoginConfigControllerParams, void > {
    prepareRequestModel(parameters: TSimpleControllerParameters): void {
        return;
    }

    public constructor(
        @inject(USECASE_FACTORY.LOGIN_CONFIG) loginConfigUseCaseFactory: TUseCaseFactory<void>,
        ) {
        super(loginConfigUseCaseFactory);
    }
}

export default LoginConfigController
