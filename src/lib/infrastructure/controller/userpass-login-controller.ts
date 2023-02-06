import { inject } from "inversify";

export default class UserPassLoginController {
    constructor(
        @inject(UserPassLoginUseCase)
        private userPassLoginUseCase: UserPassLoginInputPort,
      ) {}

    async handle(username: string, password: string, account: string, response: NextApiResponse, redirectTo: string) {
        const presenter = new UserPassLoginPresenter(response);
        await this.userPassLoginUseCase.execute(username, password, account, presenter, redirectTo);
    }
}