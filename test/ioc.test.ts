import { Container, injectable, inject } from "inversify";

interface IUseCaseInputPort {
    execute(): void;
}
interface IUseCaseOutputPort {
    present(message: string): void;
}
interface IRESTResponse {
    message: string;
    setMessage(message: string): void;
}

class RESTResponse implements IRESTResponse {
    message: string = "";
    setMessage(message: string): void {
        this.message = message;
        console.log(this.message)
    }
}

@injectable()
class TestUseCase implements IUseCaseInputPort {
    
    constructor(@inject("ITestPresenter") private presenter: IUseCaseOutputPort) {
        this.presenter = presenter;
    }
    execute(): void{
        this.presenter.present("Hello World");
    }
}

@injectable()
class TestUseCasePresenter implements IUseCaseOutputPort {
    constructor(private respone: IRESTResponse) {
        this.respone = respone;
    }
    present(message: string): void {
        this.respone.setMessage(message + Math.random());   
        console.log(message);
    }
}


describe("Test inversify", () => {
    it("should resolve the correct value", () => {
        const container = new Container();
        container.bind<IUseCaseInputPort>("ITest").to(TestUseCase).inRequestScope();
        // container.bind<IUseCaseOutputPort>("ITestPresenter").to(TestUseCasePresenter);
        const response1 = new RESTResponse();
        const response2 = new RESTResponse();
        // when getting a test use case, we want to inject a test presenter into it.
        const test_1 = container.get<TestUseCase>("ITest");
        test_1.execute();
        const test_2 = container.get<TestUseCase>("ITestPresenter");
        // expect(test).toBe(instanceOf(TestUseCase));
    });
});

