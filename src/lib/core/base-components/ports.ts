import { injectable } from "inversify";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import { PassThrough, Transform } from "stream";

export type AuthenticatedRequestModel<TRequestModel> = TRequestModel & { rucioAuthToken: string }


// INPUT PORTS AND USE CASES //
export interface BaseInputPort<TRequestModel> {
    execute(requestModel: TRequestModel): Promise<void>
}
export type TBaseUseCase<TRequestModel> = BaseInputPort<TRequestModel>

export interface BaseAuthenticatedInputPort<AuthenticatedRequestModel> {
    execute(requestModel: AuthenticatedRequestModel): Promise<void>
}
export type TAuthenticatedUseCase<TRequestModel> = BaseAuthenticatedInputPort<AuthenticatedRequestModel<TRequestModel>>

export interface BaseStreamableInputPort<AuthenticatedRequestModel> extends Transform {
    execute(requestModel: AuthenticatedRequestModel): Promise<void>
}
export type TStreamableUseCase<TRequestModel> = BaseStreamableInputPort<AuthenticatedRequestModel<TRequestModel>>

export type TUseCase<TRequestModel> = TBaseUseCase<TRequestModel> | TAuthenticatedUseCase<TRequestModel> | TStreamableUseCase<TRequestModel>

// OUTPUT PORTS //
export type TResponse = NextApiResponse | PassThrough

export interface BaseOutputPort<TResponseModel, TViewModel, TErrorModel> {
    response : TResponse
    presentSuccess(responseModel: TResponseModel): Promise<TViewModel>
    presentError( errorModel: TErrorModel): Promise<TViewModel>
}
export type BasePresenter<TResponseModel, TViewModel, TErrorModel> = BaseOutputPort<TResponseModel, TViewModel, TErrorModel>

export interface BaseStreamingOutputPort<TViewModel, TErrorModel> {
    response : TResponse
    presentStream(stream: PassThrough): Promise<TViewModel>
    presentError( errorModel: TErrorModel): Promise<TViewModel>
}
export type BaseStreamingPresneter<TViewModel, TErrorModel> = BaseStreamingOutputPort<TViewModel, TErrorModel>

// USE CASE FACTORY //
export type TUseCaseFactory<TRequestModel> = (response: NextApiResponse, session?: IronSession) => TUseCase<TRequestModel>

// CONTROLLERS //
export type TSimpleControllerParameters = {response: NextApiResponse, session?: IronSession, }
export type TAuthenticatedControllerParameters = TSimpleControllerParameters & {rucioAuthToken: string}
export type TParameters = TSimpleControllerParameters | TAuthenticatedControllerParameters

export interface IBaseController<T extends TParameters, TRequestModel>{
    useCaseFactory: TUseCaseFactory<TRequestModel>
    execute(parameters: T): Promise<void>
}

@injectable()
export abstract class BaseController<TParams extends TParameters, TRequestModel > implements IBaseController<TParams, TRequestModel>{
    useCaseFactory: TUseCaseFactory<TRequestModel>
    
    constructor(useCaseFactory: TUseCaseFactory<TRequestModel>){
        this.useCaseFactory = useCaseFactory;
    }
    
    abstract prepareRequestModel(parameters: TParams): TRequestModel;

    async execute(parameters: TParams) {
        let authenticatedRequest = false;
        if (parameters instanceof Object && 'rucioAuthToken' in parameters) {
            authenticatedRequest = true;
        }
        let useCase: TUseCase<TRequestModel>;
        if(parameters.session){
            useCase = this.useCaseFactory(parameters.response, parameters.session) as TUseCase<TRequestModel>;
        } else {
            useCase = this.useCaseFactory(parameters.response) as TUseCase<TRequestModel>;
        }

        const requestModel: TRequestModel = this.prepareRequestModel(parameters);
        if (authenticatedRequest) {
            await useCase.execute(requestModel as AuthenticatedRequestModel<TRequestModel>);
        } else {
            const simpleUseCase = useCase as unknown as BaseInputPort<TRequestModel>;
            await simpleUseCase.execute(requestModel as TRequestModel);
        }
    }
}