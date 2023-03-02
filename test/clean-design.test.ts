import { Container, injectable, inject, interfaces } from "inversify";

describe("Test Clean Architecture Design", () => {
    interface IUseCaseInputPort {
        execute(): void;
    }
    interface IUseCaseOutputPort<IRESTResponse> {
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
        }
    }
    
    @injectable()
    class TestUseCase implements IUseCaseInputPort {
        
        constructor(private presenter: IUseCaseOutputPort<any>) {
            this.presenter = presenter;
        }
        execute(): void{
            this.presenter.present("Hello World");
        }
    }
    
    @injectable()
    class TestUseCasePresenter implements IUseCaseOutputPort<IRESTResponse> {
        constructor(private respone: IRESTResponse) {
            this.respone = respone;
        }
        present(message: string): void {
            this.respone.setMessage(message + Math.random());   
        }
    }
    
    interface ITestController {
        handle(response: IRESTResponse): void;
    }
    
    @injectable()
    class TestController implements ITestController {
        private useCase: IUseCaseInputPort | null = null;
        private useCaseFactory: (response: IRESTResponse) => IUseCaseInputPort;
        public constructor(
            @inject('Factory<IUseCaseInputPort>') useCaseFactory: (response: IRESTResponse) => IUseCaseInputPort
        ) {
            this.useCaseFactory = useCaseFactory;
        }
        handle(response: IRESTResponse): void {
            this.useCase = this.useCaseFactory(response);
            this.useCase.execute();
        }
        
    }
    
    it("should present unique response for each incoming request", () => {
        const container = new Container();
        container.bind<IUseCaseInputPort>("IUseCaseInputPort").to(TestUseCase)
        // container.bind<IUseCaseOutputPort<IRESTResponse>>("IUseCaseOutputPort").to(TestUseCasePresenter);
        container.bind<ITestController>("ITestController").to(TestController);
        container.bind<interfaces.Factory<IUseCaseInputPort>>(`Factory<IUseCaseInputPort>`).toFactory<TestUseCase, [IRESTResponse]>((context: interfaces.Context) => 
            (response: IRESTResponse) => {
                return new TestUseCase(new TestUseCasePresenter(response));
            }
        );

        // this is the reponse object for the first request
        const response1 = new RESTResponse();
        // this is the response object for the second request
        const response2 = new RESTResponse();
        
        const controller = container.get<ITestController>("ITestController");
        controller.handle(response1);
        controller.handle(response2);
        
        expect(response1.message).not.toBe(response2.message);
    });
});

