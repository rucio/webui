import { UserpassLoginError, UserpassLoginResponse } from "@/lib/core/data/userpass-login";
import UserPassLoginOutputPort from "@/lib/core/port/primary/userpass-login-output-port";
import { NextApiResponse } from "next";

export default class UserPassLoginPresenter implements UserPassLoginOutputPort<NextApiResponse> {
    response: NextApiResponse;

    constructor(response: NextApiResponse) {
        this.response = response;
    }

    presentSuccess(responseModel: UserpassLoginResponse) {
        this.response.status(200).json({ responseModel });
    }

    presentError(error: UserpassLoginError) {
        this.response.status(500).json({ message: error.message });
    }
}