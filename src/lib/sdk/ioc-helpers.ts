import fs from 'fs';
import { Container, interfaces } from 'inversify';
import { IronSession } from 'iron-session';
import { NextApiResponse } from 'next';
import path from 'path';
import INPUT_PORT from '../infrastructure/ioc/ioc-symbols-input-port';
import { BaseController, TParameters } from './controller';
import type { BaseInputPort, BaseOutputPort } from './primary-ports';
import { BaseUseCase, TUseCase } from './usecase';
import TUseCaseFactory from './usecase-factory';

export type IOCSymbols = {
    CONTROLLER: symbol,
    USECASE_FACTORY: symbol,
    INPUT_PORT: symbol,
}



export function createIOCBindings<
    TControllerParams extends TParameters,
    TRequestModel,
    TResponseModel,
    TErrorModel,
    TOutput_Port extends new (response: NextApiResponse, session?: IronSession) => BaseOutputPort<any, any>,
    >(
        appContainer: Container,
        Controller: new (useCaseFactory: TUseCaseFactory<TRequestModel>) => BaseController<TControllerParams, TRequestModel>,
        UseCase: new (presenter: BaseOutputPort<TResponseModel, TErrorModel>, ...args: any[]) => TUseCase<TRequestModel>, 
        useCaseContructorArgs: any[] = [],
        Presenter: TOutput_Port,
        passSessionToPresenter: boolean = false,
        symbols: IOCSymbols,

    ){
        const symbolInputPort = symbols.INPUT_PORT
        const symbolController = symbols.CONTROLLER
        const symbolUseCaseFactory = symbols.USECASE_FACTORY

        appContainer.bind<BaseInputPort<TRequestModel>>(symbolInputPort).to(UseCase).inRequestScope();
        appContainer.bind<BaseController<TControllerParams, TRequestModel>>(symbolController).to(Controller).inRequestScope();

        if(passSessionToPresenter){
        appContainer.bind<interfaces.Factory<TUseCase<TRequestModel>>>(symbolUseCaseFactory).toFactory<TUseCase<TRequestModel>, [response: NextApiResponse, session: IronSession]>((context: interfaces.Context) =>
            (response: NextApiResponse, session: IronSession) => {
                const presenter = new Presenter(response, session);
                return new UseCase(presenter, ...useCaseContructorArgs);
            }
        );
        } else {
            appContainer.bind<interfaces.Factory<TUseCase<TRequestModel>>>(symbolUseCaseFactory).toFactory<TUseCase<TRequestModel>, [response: NextApiResponse]>((context: interfaces.Context) =>
            (response: NextApiResponse) => {
                const presenter = new Presenter(response);
                return new UseCase(presenter, ...useCaseContructorArgs);
            }
        );
        }
    }


/**
 * @deprecated
 */
export async function loadFeature(feature: string, appContainer: Container) {
    const CONTROLLER = path.join(process.cwd(), 'src', 'lib', 'infrastructure', 'controller');
    const USECASE = path.join(process.cwd(), 'src', 'lib', 'core', 'use-case');
    const PORTS = path.join(process.cwd(), 'src', 'lib', 'core', 'port', 'primary');
    const controllerModule = await import(`${CONTROLLER}/${feature}-controller`);
    const usecaseModule = await import(`${USECASE}/${feature}-usecase`);
    const portsModule = await import(`${PORTS}/${feature}-ports`);
  
    const { default: defaultController, regularController } = controllerModule;
    const usecase = usecaseModule.default;
    const { InputPort, OutputPort } = portsModule;
    appContainer.bind('Controller').toConstantValue(controllerModule);
    // createIOCBindings<any, typeof InputPort, typeof usecase, typeof OutputPort, typeof regularController>(appContainer, defaultController, usecase, [], OutputPort, false);
    INPUT_PORT
}