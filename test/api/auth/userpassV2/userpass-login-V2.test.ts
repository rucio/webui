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
import { Role } from "@/lib/core/entity/auth-models";


describe("Feature: UserpassLoginV2 API tests", () => {
    beforeEach(() => {
        process.env.RUCIO_AUTH_HOST = MockRucioServerFactory.RUCIO_HOST
        fetchMock.doMock();

        const getuserpassLoginV2MockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/auth/userpass`,
            method: 'GET',
            includes: 'userpass',
            response: {
                status: 200,
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Headers": "None",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Origin": "None",
                    "Access-Control-Expose-Headers": "X-Rucio-Auth-Token, X-Rucio-Auth-Token-Expires, X-Rucio-Auth-Account, X-Rucio-Auth-Accounts",
                    "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate, post-check=0, pre-check=0",
                    "Connection": "close",
                    "Content-Length": "0",
                    "Content-Type": "application/octet-stream",
                    "Date": "Thu, 02 May 2024 15:02:40 GMT",
                    "Pragma": "no-cache",
                    "Server": "Werkzeug/3.0.2 Python/3.9.18",
                    "X-Rucio-Auth-Account": "root",
                    "X-Rucio-Auth-Token": "root-ddmlab-unknown-998c33f798314f5e81c6a74fc15f8899",
                    "X-Rucio-Auth-Token-Expires": "Thu, 02 May 2024 16:02:40 UTC",
                },

                body: JSON.stringify({
                })
            }
        }

        const getAccountAttributesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/root/attr`,
            method: "GET",
            includes: "attr",
            response: {
                status: 200,
                headers: {},
                body: JSON.stringify(
                    [
                        {
                            "key": "admin",
                            "value": "True"
                        },
                        {
                            "key": "country-Jamaica",
                            "value": "admin"
                        }
                    ]
                )
            }
        }

        MockRucioServerFactory.createMockRucioServer(false, [getuserpassLoginV2MockEndpoint, getAccountAttributesMockEndpoint]);
    });

    afterEach(() => {
        process.env.RUCIO_AUTH_HOST = undefined
        fetchMock.dontMock();
    });

    it("should return a view model for a valid request to UserpassLoginV2 feature", async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'ddmlab',
                password: 'secret',
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
        expect(res._getStatusCode()).toBe(200)

        // test if the view model is what we expect :

        const data: UserpassLoginV2ViewModel = await res._getJSONData()

        expect(data.status).toBe('success')
        expect(data).toHaveProperty('role')
        expect(data.role).toBe(Role.ADMIN)
        expect(data).toHaveProperty('countryRole')
        expect(data.countryRole).toBe(Role.ADMIN)
        expect(data).toHaveProperty('rucioAccount');
        expect(data.rucioAccount).toBe('root')
        expect(data).toHaveProperty('country')
        expect(data.country).toBe('Jamaica')
        expect(data).toHaveProperty('rucioIdentity');
        expect(data.rucioIdentity).toBe('ddmlab')
        expect(data).toHaveProperty('rucioAuthToken');
        expect(data.rucioAuthToken).toBe('root-ddmlab-unknown-998c33f798314f5e81c6a74fc15f8899');
        expect(data).toHaveProperty('rucioAuthTokenExpires');
        expect(data.rucioAuthTokenExpires).toBe('Thu, 02 May 2024 16:02:40 UTC');

        // test if the session is what we expect : 

        expect(session.user).toHaveProperty('rucioIdentity');
        expect(session.user?.rucioIdentity).toBe('ddmlab');
        expect(session.user).toHaveProperty('rucioAuthToken');
        expect(session.user?.rucioAuthToken).toBe('root-ddmlab-unknown-998c33f798314f5e81c6a74fc15f8899');
        expect(session.user).toHaveProperty('rucioAccount');
        expect(session.user?.rucioAccount).toBe('root');
        expect(session.user).toHaveProperty('isLoggedIn');
        expect(session.user?.isLoggedIn).toBe(true);
        expect(session.user).toHaveProperty('rucioAuthTokenExpires');
        expect(session.user?.rucioAuthTokenExpires).toBe('Thu, 02 May 2024 16:02:40 UTC');
        expect(session.user).toHaveProperty('role')
        expect(session.user?.role).toBe(Role.ADMIN)
        expect(session.user).toHaveProperty('country')
        expect(session.user?.country).toBe('Jamaica')
        expect(session.user).toHaveProperty('countryRole')
        expect(session.user?.countryRole).toBe(Role.ADMIN)

    });

});