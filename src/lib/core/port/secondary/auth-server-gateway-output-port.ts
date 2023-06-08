import { UserPassLoginAuthServerDTO } from "../../data/dto/auth-server-dto";

export default interface AuthServerGatewayOutputPort { 
    userpassLogin(username: string, password: string, account: string, vo: string): Promise<UserPassLoginAuthServerDTO>
}