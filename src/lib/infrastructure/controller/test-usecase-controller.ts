import IUseCaseInputPort from "@/lib/core/port/primary/test-usecase-input-port";
import { NextApiResponse } from "next";
import { inject, injectable } from "inversify";
import USECASE_FACTORY from "../config/ioc/ioc-symbols-usecase-factory";

export interface ITestController {
    handle(response: NextApiResponse): void;
}

@injectable()
class TestController implements ITestController {
    private useCase: IUseCaseInputPort | null = null;
    private useCaseFactory: (response: NextApiResponse) => IUseCaseInputPort;
    public constructor(
        @inject(USECASE_FACTORY.TEST) useCaseFactory: (response: NextApiResponse) => IUseCaseInputPort
    ) {
        this.useCaseFactory = useCaseFactory;
    }
    handle(response: NextApiResponse): void {
        this.useCase = this.useCaseFactory(response);
        this.useCase.execute();
    }
}

export default TestController