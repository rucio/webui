import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { Role } from "../entity/auth-models";


/**
* @interface UserpassLoginV2Request represents the RequestModel for userpass_login_V2 usecase
*/
export interface UserpassLoginV2Request {
    username: string;
    password: string;
    account: string;
    vo: string;
    redirectTo: string;
}



/** 
* @interface UserpassLoginV2Response represents the ResponseModel for userpass_login_V2 usecase
*/

export interface UserpassLoginV2Response extends BaseResponseModel {
    rucioIdentity: string;
    rucioAccount: string;
    vo: string;
    rucioAuthToken: string;
    rucioAuthTokenExpires: string;
    role: Role | undefined;
    // ATLAS specific, used for country-{} account attribute in Rucio
    country?: string;
    countryRole?: Role;
}

/**
* @interface UserpassLoginV2Error represents the ErrorModel for userpass_login_V2 usecase
* add link to output port later
* @property {string} type - Type of error: 
* 'AUTH_SERVER_CONFIGURATION_ERROR':If webui's environment file is missing the configuration variable for rucio auth server
* 'AUTH_SERVER_SIDE_ERROR': If rucio auth server returns an error
* 'INVALID_CREDENTIALS': If the user entered invalid credentials
* 'ACCOUNT_ATTRIBUTE_ERROR' : If the error occured during the fetch of the account attributes
* 'UNDEFINED_REQUEST_MODEL' : If the error is caused by an undefined request model
* 'UNKNOWN_ERROR': If the error is not one of the above
* @property {string} message - Error message
*/

export interface UserpassLoginV2Error extends BaseErrorResponseModel {
    type: 'AUTH_SERVER_CONFIGURATION_ERROR' | 'AUTH_SERVER_SIDE_ERROR' | 'INVALID_CREDENTIALS' | 'UNKNOWN_ERROR' | 'ACCOUNT_ATTRIBUTE_ERROR' | 'UNDEFINED_REQUEST_MODEL';
    message: string;
}

