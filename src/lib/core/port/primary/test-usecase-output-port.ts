import { UserpassLoginResponse } from "../../data/userpass-login";

export default interface IUseCaseOutputPort<T> {
    response: T;
    present(responseModel: UserpassLoginResponse): void;
}
