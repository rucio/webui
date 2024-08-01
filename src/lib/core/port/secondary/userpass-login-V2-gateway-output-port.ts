import { UserPassLoginV2AuthServerDTO } from "../../dto/userpassLoginV2-dto";

export default interface AuthServerGatewayOutputPort {
    getuserpassLoginV2(username: string, password: string, account: string, vo: string): Promise<UserPassLoginV2AuthServerDTO>
}