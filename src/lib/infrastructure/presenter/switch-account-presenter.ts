import { SwitchAccountResponse, SwitchAccountError } from "@/lib/core/data/switch-account-usecase-models";
import SwitchAccountOutputPort from "@/lib/core/port/primary/switch-account-output-port";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";

export default class SwitchAccountPresenter implements SwitchAccountOutputPort<NextApiResponse> {
    response: NextApiResponse;

    constructor(response: NextApiResponse) {
        this.response = response;
    }
    
    async presentSuccess(responseModel: SwitchAccountResponse): Promise<void> {
        this.response.redirect(responseModel.redirectTo);
    }

    async presentError(error: SwitchAccountError): Promise<void> {
        switch(error.type) {
            case 'invalid_auth_type': {
                this.response.status(400).json({
                    error: 'Invalid auth type. Must be one of: userpass, x509, oidc',
                    message: error.message
                })
                break;
            }
            case'bad request':{
                this.response.status(400).json({
                    error: 'Bad request',
                    message: error
                })
                break;
            }
            case 'cannot_switch_account': {
                this.response.status(500).json({
                    error: 'Cannot switch account',
                    message: error.message
                })
            }
            default: {
                this.response.status(500).json({
                    message: 'Could not switch account, this is possibly a bug. Please report to the developers!'
                })
            }
        }

    }

}