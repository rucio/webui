import { UserpassLoginResponse } from "@/lib/core/data/userpass-login";
import { RucioUser } from "@/lib/core/entity/auth-models";
import UserPassLoginOutputPort from "@/lib/core/port/primary/userpass-login-output-port";
import { NextApiResponse } from "next";

export default class UserPassLoginPresenter implements UserPassLoginOutputPort<NextApiResponse> {
    response: any;

    constructor(response: NextApiResponse) {
        this.response = response;
    }

    presentSuccess(responseModel: UserpassLoginResponse) {
        this.response.status(200).json({ responseModel });
    }

    presentError(error: Error, redirectTo?: string) {
        this.response.status(500).json({ error, redirectTo });
    }

    setResponseHandler(handler: NextApiResponse) {
        this.response = handler;
    }
}