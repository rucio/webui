import "reflect-metadata"
import { inject, injectable, Container, interfaces } from 'inversify';
import type { NextApiResponse } from 'next';
import type IUseCaseInputPort from '@/lib/core/port/primary/test-usecase-input-port';
import TestUseCase from "@/lib/core/use-case/test-usecase";
import TestUseCasePresenter from "@/lib/infrastructure/presenter/test-presenter";
import TestController, { ITestController } from "@/lib/infrastructure/controller/test-usecase-controller";
import CONTROLLERS from "./ioc-symbols-controllers";
import USECASE_FACTORY from "./ioc-symbols-usecase-factory";
import INPUT_PORT from "@/lib/common/ioc/ioc-symbols-input-port";


const container = new Container();
// container.bind<IUseCaseInputPort>(INPUT_PORT.TEST).to(TestUseCase).inRequestScope();
// container.bind<IUseCaseOutputPort<IRESTResponse>>("IUseCaseOutputPort").to(TestUseCasePresenter);
container.bind<ITestController>(CONTROLLERS.TEST).to(TestController);
container.bind<interfaces.Factory<IUseCaseInputPort>>(USECASE_FACTORY.TEST).toFactory<TestUseCase, [NextApiResponse]>((context: interfaces.Context) =>
    (response: NextApiResponse) => {
        return new TestUseCase(new TestUseCasePresenter(response));
    }
);

export default container;