import { AccountAttributesDTO } from "../../dto/account-dto";

export default interface AccountGatewayOutputPort {
    listAccountAttributes(account: string, rucioAuthToken: string): Promise<AccountAttributesDTO>
}