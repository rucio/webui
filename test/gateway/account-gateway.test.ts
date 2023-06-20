import { AccountAttributeErrorTypesDTO, AccountAttributesDTO } from "@/lib/core/dto/account-dto";
import AccountGatewayOutputPort from "@/lib/core/port/secondary/account-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import { getIronSession } from "iron-session";
import { createMocks } from "node-mocks-http";

describe("Account Gateway Tests", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, (req) => {
            if (req.url.endsWith('/accounts/ddmadmin/attr')) {
                const rucioToken = req.headers.get('X-Rucio-Auth-Token')
                if(rucioToken !== 'rucio-ddmlab-askdjljioj') {
                    return Promise.resolve({
                        status: 401,
                    })
                }
                expect(req.headers.get('X-Rucio-Auth-Token')).toBe('rucio-ddmlab-askdjljioj')
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([
                        {
                            "key": "admin",
                            "value": "True"
                        },
                        {
                            "key": "country-tw",
                            "value": "user"
                        }
                    ])
                })
            }
        })
    })
    afterEach(() => {
        fetchMock.dontMock();
    })
    test("it should return account attributes", async () => {
        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT)
        const accoutAttrs: AccountAttributesDTO = await rucioAccountGateway.listAccountAttributes('ddmadmin', 'rucio-ddmlab-askdjljioj')
        expect(accoutAttrs).toEqual({
            status: 'OK',
            account: 'ddmadmin',
            attributes: [
                {
                    key: 'admin',
                    value: 'True'
                },
                {
                    key: 'country-tw',
                    value: 'user'
                }
            ]
        })
    })
    test("it should return authentication error with invalid token request", async () => {
        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT)
        try {
            const accoutAttrs: AccountAttributesDTO = await rucioAccountGateway.listAccountAttributes('ddmadmin', 'invalid-token')
        } catch (error: AccountAttributesDTO | any) {
            error.status = 'ERROR'
            expect(error).toEqual({
                status: 'ERROR',
                error: AccountAttributeErrorTypesDTO.RUCIO_AUTH_TOKEN_IS_INVALID_OR_EXPIRED,
                account: 'ddmadmin',
                attributes: {},
                message: 'Rucio Auth Token is invalid or expired'
            })
        }
    })
})