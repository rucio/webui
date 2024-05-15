import appContainer from "@/lib/infrastructure/ioc/container-config";
import { UserpassLoginV2Request } from "@/lib/core/usecase-models/userpass-login-V2-usecase-models";
import { UserpassLoginV2ControllerParameters } from "@/lib/infrastructure/controller/userpass-login-V2-controller"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import { BaseController } from "@/lib/sdk/controller";
import { UserpassLoginV2ViewModel } from "@/lib/infrastructure/data/view-model/UserpassloginV2";
import { NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { getIronSession } from "iron-session";
import { setEmptySession } from "@/lib/infrastructure/auth/session-utils";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server"

describe("Feature: UserpassLoginV2 API tests 2", () => {
    beforeEach(() => {
        process.env.RUCIO_AUTH_HOST = MockRucioServerFactory.RUCIO_HOST
        fetchMock.doMock();

        const getuserpassLoginV2MockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/auth/userpass`,
            method: 'GET',
            includes: 'userpass',
            response: {
                status: 401,
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Headers": "None",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Origin": "None",
                    "Access-Control-Expose-Headers": "X-Rucio-Auth-Token, X-Rucio-Auth-Token-Expires, X-Rucio-Auth-Account, X-Rucio-Auth-Accounts",
                    "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate, post-check=0, pre-check=0",
                    "Connection": "close",
                    "Content-Length": "122",
                    "Content-Type": "application/octet-stream",
                    "Date": "Mon, 06 May 2024 08:19:28 GMT",
                    "Exceptionclass": "CannotAuthenticate",
                    "Exceptionmessage": "Cannot authenticate to account root with given credentials",
                    "Pragma": "no-cache",
                    "Server": " Werkzeug/3.0.2 Python/3.9.18",

                },

                body: JSON.stringify({
                    "ExceptionClass": "CannotAuthenticate",
                    "ExceptionMessage": "Cannot authenticate to account root with given credentials"
                })
            }
        }

        const getAccountAttributesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/root/attr`,
            method: "GET",
            includes: "attr",
            response: {
                status: 401,
                headers: {},
                body: JSON.stringify(
                    {
                        "ExceptionClass": "CannotAuthenticate",
                        "ExceptionMessage": "Cannot authenticate with given credentials"
                    }
                )
            }
        }

        MockRucioServerFactory.createMockRucioServer(false, [getuserpassLoginV2MockEndpoint, getAccountAttributesMockEndpoint]);
    });

    afterEach(() => {
        process.env.RUCIO_AUTH_HOST = undefined
        fetchMock.dontMock();
    });

    it("should return an error model for an invalid request to UserpassLoginV2 feature : invalid credentials", async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'ddmlab',
                password: 'secrt',
            }
        });
        const session = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })

        await setEmptySession(session, true)

        const controller = appContainer.get<BaseController<UserpassLoginV2ControllerParameters, UserpassLoginV2Request>>(CONTROLLERS.USERPASS_LOGIN_V2)
        const controllerParameters: UserpassLoginV2ControllerParameters = {
            response: res as unknown as NextApiResponse,
            username: req.body.username,
            password: req.body.password,
            account: 'root',
            vo: 'def',
            session: session,
            redirectTo: '/dashboard',

        }

        await controller.execute(controllerParameters)
        expect(res._getStatusCode()).toBe(401)

        // test if the view model is what we expect :

        const data: UserpassLoginV2ViewModel = await res._getJSONData()

        expect(data.status).toBe('error')
        expect(data).toHaveProperty('error_cause')
        expect(data.error_cause).toBe("INVALID_CREDENTIALS")
        expect(data).toHaveProperty("message")
        expect(data.message).toBe('Invalid username, password or account, please check your credentials and try again')

    });

});