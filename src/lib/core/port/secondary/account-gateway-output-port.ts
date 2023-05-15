import { AccountAttributesDTO } from "../../data/account-dto";

export default interface AccountGatewayOutputPort {
    listAccountAttributes(account: string, rucioAuthToken: string): Promise<AccountAttributesDTO>
}