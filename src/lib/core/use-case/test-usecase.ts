import IUseCaseInputPort from "../port/primary/test-usecase-input-port";
import { injectable } from "inversify";
import type IUseCaseOutputPort from "../port/primary/test-usecase-output-port";
import { UserpassLoginResponse } from "../data/userpass-login";


@injectable()
class TestUseCase implements IUseCaseInputPort {

    constructor(private presenter: IUseCaseOutputPort<any>) {
        this.presenter = presenter;
    }
    execute(): void {
        const responseModel: UserpassLoginResponse = {
            rucioIdentity: 'test',
            rucioAuthToken: 'test',
            rucioAccount: 'test',
            rucioAuthType: 'test',
        }
        this.presenter.present(responseModel);
    }
}

export default TestUseCase;