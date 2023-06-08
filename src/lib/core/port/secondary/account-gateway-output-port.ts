import { AccountAttributesDTO } from "../../data/dto/account-dto";

export default interface AccountGatewayOutputPort {
    listAccountAttributes(account: string, rucioAuthToken: string): Promise<AccountAttributesDTO>
}