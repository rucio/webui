import type { NextApiRequest, NextApiResponse } from 'next';
import { inject, injectable, Container, interfaces } from 'inversify';
import { withSessionRoute } from '@/lib/infrastructure/auth/session-utils';

const logoutRoute = (req: NextApiRequest, res: NextApiResponse) => {
    interface IUseCaseInputPort {
        execute(): void;
    }
    interface IUseCaseOutputPort<T> {
        response: T;
        present(message: string): void;
    }
    // interface IRESTResponse {
    //     message: string;
    //     setMessage(message: string): void;
    // }

    // class RESTResponse implements IRESTResponse {
    //     message: string = "";
    //     setMessage(message: string): void {
    //         this.message = message;
    //     }
    // }

    @injectable()
    class TestUseCase implements IUseCaseInputPort {

        constructor(private presenter: IUseCaseOutputPort<any>) {
            this.presenter = presenter;
        }
        execute(): void {
            this.presenter.present("Hello World");
        }
    }

    @injectable()
    class TestUseCasePresenter implements IUseCaseOutputPort<NextApiResponse> {
        response: NextApiResponse;
        constructor(response: NextApiResponse) {
            this.response = response;
        }
        present(message: string): void {
            this.response.status(200).json(message + Math.random());
        }
    }

    interface ITestController {
        handle(response: NextApiResponse): void;
    }

    @injectable()
    class TestController implements ITestController {
        private useCase: IUseCaseInputPort | null = null;
        private useCaseFactory: (response: NextApiResponse) => IUseCaseInputPort;
        public constructor(
            @inject('Factory<IUseCaseInputPort>') useCaseFactory: (response: NextApiResponse) => IUseCaseInputPort
        ) {
            this.useCaseFactory = useCaseFactory;
        }
        handle(response: NextApiResponse): void {
            this.useCase = this.useCaseFactory(response);
            this.useCase.execute();
        }
    }

    const container = new Container();
    container.bind<IUseCaseInputPort>("IUseCaseInputPort").to(TestUseCase).inRequestScope();
    // container.bind<IUseCaseOutputPort<IRESTResponse>>("IUseCaseOutputPort").to(TestUseCasePresenter);
    container.bind<ITestController>("ITestController").to(TestController);
    container.bind<interfaces.Factory<IUseCaseInputPort>>('Factory<IUseCaseInputPort>').toFactory<TestUseCase, [NextApiResponse]>((context: interfaces.Context) =>
        (response: NextApiResponse) => {
            return new TestUseCase(new TestUseCasePresenter(response));
        }
    );

    const controller = container.get<ITestController>("ITestController");
    // const response1 = new RESTResponse();
    // const response2 = new RESTResponse();
    controller.handle(res);
    // controller.handle(response2);
}


export default withSessionRoute(logoutRoute);