import "reflect-metadata"
import { inject, injectable, Container, interfaces } from 'inversify';
import type { NextApiResponse } from 'next';
import type IUseCaseInputPort from '@/lib/core/port/primary/test-usecase-input-port';
import TestUseCase from "@/lib/core/use-case/test-usecase";
import TestUseCasePresenter from "@/lib/infrastructure/presenter/test-presenter";


export interface ITestController {
    handle(response: NextApiResponse): void;
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

export default container;