import { injectable } from 'inversify';
import { NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { BaseInputPort } from './primary-ports';
import { TUseCase } from './usecase';
import type TUseCaseFactory from './usecase-factory';
import { AuthenticatedRequestModel } from './usecase-models';

export type TSimpleControllerParameters = { response: NextApiResponse, session?: Session };
export type TAuthenticatedControllerParameters = TSimpleControllerParameters & { rucioAuthToken: string };
export type TParameters = TSimpleControllerParameters | TAuthenticatedControllerParameters;

export interface IBaseController<T extends TParameters, TRequestModel> {
    useCaseFactory: TUseCaseFactory<TRequestModel>;
    execute(parameters: T): Promise<void>;
}

@injectable()
export abstract class BaseController<TParams extends TParameters, TRequestModel> implements IBaseController<TParams, TRequestModel> {
    useCaseFactory: TUseCaseFactory<TRequestModel>;

    constructor(useCaseFactory: TUseCaseFactory<TRequestModel>) {
        this.useCaseFactory = useCaseFactory;
    }

    abstract prepareRequestModel(parameters: TParams): TRequestModel;

    async execute(parameters: TParams) {
        let authenticatedRequest = false;
        if (parameters instanceof Object && 'rucioAuthToken' in parameters) {
            authenticatedRequest = true;
        }
        const useCase = this.useCaseFactory(parameters.response) as TUseCase<TRequestModel>;
        const requestModel: TRequestModel = this.prepareRequestModel(parameters);
        if (authenticatedRequest) {
            await useCase.execute(requestModel as AuthenticatedRequestModel<TRequestModel>);
        } else {
            const simpleUseCase = useCase as unknown as BaseInputPort<TRequestModel>;
            await simpleUseCase.execute(requestModel as TRequestModel);
        }
    }
}
