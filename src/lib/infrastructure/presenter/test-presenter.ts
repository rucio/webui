import IUseCaseOutputPort from "@/lib/core/port/primary/test-usecase-output-port";
import type { NextApiResponse } from "next";
import { injectable } from "inversify";

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

export default TestUseCasePresenter;