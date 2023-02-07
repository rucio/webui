import IUseCaseInputPort from "../port/primary/test-usecase-input-port";
import { injectable } from "inversify";
import type IUseCaseOutputPort from "../port/primary/test-usecase-output-port";


@injectable()
class TestUseCase implements IUseCaseInputPort {

    constructor(private presenter: IUseCaseOutputPort<any>) {
        this.presenter = presenter;
    }
    execute(): void {
        this.presenter.present("Hello World");
    }
}

export default TestUseCase;