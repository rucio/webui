import { Container, interfaces } from 'inversify';
import { RucioSession } from '@/lib/infrastructure/auth/session';
import { BaseController, TParameters } from './controller';
import { BasePresenter, BaseStreamingPresenter } from './presenter';
import type { BaseInputPort, BaseOutputPort, BaseStreamingOutputPort } from './primary-ports';
import { TUseCase } from './usecase';
import TUseCaseFactory from './usecase-factory';
import { BaseErrorResponseModel, BaseResponseModel } from './usecase-models';
import { BaseViewModel } from './view-models';
import { Signal } from './web';

/**
 * An object that contains symbols for the different types of dependencies in an IoC container.
 */
export type IOCSymbols = {
    CONTROLLER: symbol; // A symbol for the controller dependency.
    USECASE_FACTORY: symbol; // A symbol for the use case factory dependency.
    INPUT_PORT: symbol; // A symbol for the input port dependency.
};

/**
 * A base interface for loadable features in the web application.
 */
export interface IFeature {
    name: string;
    /**
     * Load the feature into the IoC container.
     * @param appContainer The IoC container for the application.
     */
    load(appContainer: Container): void;
}

/**
 * A base class for features in a web application. The IOC bindings for the clean architecture components
 * of the feature are generated automatically.
 * @template TControllerParams The type of the parameters for the controller.
 * @template TRequestModel The type of the request model for the use case.
 * @template TResponseModel The type of the response model for the use case.
 * @template TErrorModel The type of the error model for the use case.
 * @template TViewModel The type of the view model for the presenter.
 */
export class BaseFeature<TControllerParams extends TParameters, TRequestModel, TResponseModel, TErrorModel, TViewModel> implements IFeature {
    /**
     * Creates a new instance of the `BaseFeature` class.
     * @template TControllerParams The type of the parameters for the controller.
     * @template TRequestModel The type of the request model for the use case.
     * @template TResponseModel The type of the response model for the use case.
     * @template TErrorModel The type of the error model for the use case.
     * @template TViewModel The type of the view model for the presenter.
     * @param appContainer The IoC container for the application.
     * @param Controller The controller class for the feature.
     * @param UseCase The use case class for the feature.
     * @param useCaseContructorArgs The arguments to pass to the use case constructor.
     * @param Presenter The presenter class for the feature.
     * @param passSessionToPresenter Whether to pass the session to the presenter.
     * @param symbols An object that contains symbols for the different types of dependencies in the IoC container.
     */
    public constructor(
        public name: string,
        private Controller: new (useCaseFactory: TUseCaseFactory<TRequestModel>) => BaseController<TControllerParams, TRequestModel>,
        private UseCase: new (presenter: BaseOutputPort<TResponseModel, TErrorModel>, ...args: any[]) => TUseCase<TRequestModel>,
        private useCaseContructorArgs: any[] = [],
        private Presenter: new (response: Signal<TViewModel>, session?: RucioSession) => BasePresenter<TResponseModel, TErrorModel, TViewModel>,
        private passSessionToPresenter: boolean = false,
        private symbols: IOCSymbols,
    ) {}

    /**
     * Load this feature into the IoC container.
     * @param appContainer The IoC container for the application.
     */
    load(appContainer: Container): void {
        this.createIOCBindings<TControllerParams, TRequestModel, TResponseModel, TErrorModel, TViewModel>(
            appContainer,
            this.Controller,
            this.UseCase,
            this.useCaseContructorArgs,
            this.Presenter,
            this.passSessionToPresenter,
            this.symbols,
        );
    }

    /**
     * Creates IoC bindings for a feature.
     * @template TControllerParams The type of the parameters for the controller.
     * @template TRequestModel The type of the request model for the use case.
     * @template TResponseModel The type of the response model for the use case.
     * @template TErrorModel The type of the error model for the use case.
     * @template TViewModel The type of the view model for the presenter.
     * @param appContainer The IoC container for the application.
     * @param Controller The controller class for the feature.
     * @param UseCase The use case class for the feature.
     * @param useCaseContructorArgs The arguments to pass to the use case constructor.
     * @param Presenter The presenter class for the feature.
     * @param passSessionToPresenter Whether to pass the session to the presenter.
     * @param symbols An object that contains symbols for the different types of dependencies in the IoC container.
     */
    createIOCBindings<TControllerParams extends TParameters, TRequestModel, TResponseModel, TErrorModel, TViewModel>(
        appContainer: Container,
        Controller: new (useCaseFactory: TUseCaseFactory<TRequestModel>) => BaseController<TControllerParams, TRequestModel>,
        UseCase: new (presenter: BaseOutputPort<TResponseModel, TErrorModel>, ...args: any[]) => TUseCase<TRequestModel>,
        useCaseContructorArgs: any[] = [],
        Presenter: new (response: Signal<TViewModel>, session?: RucioSession) => BasePresenter<TResponseModel, TErrorModel, TViewModel>,
        passSessionToPresenter: boolean = false,
        symbols: IOCSymbols,
    ) {
        const symbolInputPort = symbols.INPUT_PORT;
        const symbolController = symbols.CONTROLLER;
        const symbolUseCaseFactory = symbols.USECASE_FACTORY;

        appContainer.bind<BaseInputPort<TRequestModel>>(symbolInputPort).to(UseCase).inRequestScope();
        appContainer.bind<BaseController<TControllerParams, TRequestModel>>(symbolController).to(Controller).inRequestScope();

        if (passSessionToPresenter) {
            appContainer
                .bind<interfaces.Factory<TUseCase<TRequestModel>>>(symbolUseCaseFactory)
                .toFactory<TUseCase<TRequestModel>, [response: Signal<TViewModel>, session: RucioSession]>(
                    (context: interfaces.Context) => (response: Signal<TViewModel>, session: RucioSession) => {
                        const presenter = new Presenter(response, session);
                        return new UseCase(presenter, ...useCaseContructorArgs);
                    },
                );
        } else {
            appContainer
                .bind<interfaces.Factory<TUseCase<TRequestModel>>>(symbolUseCaseFactory)
                .toFactory<TUseCase<TRequestModel>, [response: Signal<TViewModel>]>(
                    (context: interfaces.Context) => (response: Signal<TViewModel>) => {
                        const presenter = new Presenter(response);
                        return new UseCase(presenter, ...useCaseContructorArgs);
                    },
                );
        }
    }
}

/**
 * A base class for streamable features in a web application.
 * @template TControllerParams The type of the parameters for the controller.
 * @template TRequestModel The type of the request model for the use case.
 * @template TResponseModel The type of the response model for the use case.
 * @template TErrorModel The type of the error model for the use case.
 * @template TViewModel The type of the view model for the stream.
 */
export class BaseStreamableFeature<
    TControllerParams extends TParameters,
    TRequestModel,
    TResponseModel extends BaseResponseModel,
    TErrorModel extends BaseErrorResponseModel,
    TViewModel extends BaseViewModel,
> implements IFeature
{
    /**
     * Creates a new instance of the `BaseStreamableFeature` class.
     * @param appContainer The IoC container for the application.
     * @param Controller The controller class for the feature.
     * @param UseCase The use case class for the feature.
     * @param useCaseContructorArgs The arguments to pass to the use case constructor.
     * @param Presenter The presenter class for the feature.
     * @param passSessionToPresenter Whether to pass the session to the presenter.
     * @param symbols An object that contains symbols for the different types of dependencies in the IoC container.
     */
    constructor(
        public name: string,
        private Controller: new (useCaseFactory: TUseCaseFactory<TRequestModel>) => BaseController<TControllerParams, TRequestModel>,
        private UseCase: new (presenter: BaseStreamingOutputPort<TResponseModel, TErrorModel, TViewModel>, ...args: any[]) => TUseCase<TRequestModel>,
        private useCaseContructorArgs: any[] = [],
        private Presenter: new (response: Signal<TViewModel>, session?: RucioSession) => BaseStreamingPresenter<
            TResponseModel,
            TErrorModel,
            TViewModel
        >,
        private passSessionToPresenter: boolean = false,
        private symbols: IOCSymbols,
    ) {}

    /**
     * Load this feature into the IoC container.
     * @param appContainer The IoC container for the application.
     */
    public load(appContainer: Container): void {
        this.createIOCBindings<TControllerParams, TRequestModel, TResponseModel, TErrorModel, TViewModel>(
            appContainer,
            this.Controller,
            this.UseCase,
            this.useCaseContructorArgs,
            this.Presenter,
            this.passSessionToPresenter,
            this.symbols,
        );
    }

    /**
     * Creates the IoC bindings for the streamable feature.
     * @param appContainer The IoC container for the application.
     * @param Controller The controller class for the feature.
     * @param UseCase The use case class for the feature.
     * @param useCaseContructorArgs The arguments to pass to the use case constructor.
     * @param Presenter The presenter class for the feature.
     * @param passSessionToPresenter Whether to pass the session to the presenter.
     * @param symbols An object that contains symbols for the different types of dependencies in the IoC container.
     */
    createIOCBindings<
        TControllerParams extends TParameters,
        TRequestModel,
        TResponseModel extends BaseResponseModel,
        TErrorModel extends BaseErrorResponseModel,
        TViewModel extends BaseViewModel,
    >(
        appContainer: Container,
        Controller: new (useCaseFactory: TUseCaseFactory<TRequestModel>) => BaseController<TControllerParams, TRequestModel>,
        UseCase: new (presenter: BaseStreamingOutputPort<TResponseModel, TErrorModel, TViewModel>, ...args: any[]) => TUseCase<TRequestModel>,
        useCaseContructorArgs: any[] = [],
        Presenter: new (response: Signal<TViewModel>, session?: RucioSession) => BaseStreamingPresenter<TResponseModel, TErrorModel, TViewModel>,
        passSessionToPresenter: boolean = false,
        symbols: IOCSymbols,
    ) {
        const symbolInputPort = symbols.INPUT_PORT;
        const symbolController = symbols.CONTROLLER;
        const symbolUseCaseFactory = symbols.USECASE_FACTORY;

        appContainer.bind<BaseInputPort<TRequestModel>>(symbolInputPort).to(UseCase).inRequestScope();
        appContainer.bind<BaseController<TControllerParams, TRequestModel>>(symbolController).to(Controller).inRequestScope();

        if (passSessionToPresenter) {
            appContainer
                .bind<interfaces.Factory<TUseCase<TRequestModel>>>(symbolUseCaseFactory)
                .toFactory<TUseCase<TRequestModel>, [response: Signal<TViewModel>, session: RucioSession]>(
                    (context: interfaces.Context) => (response: Signal<TViewModel>, session: RucioSession) => {
                        const presenter = new Presenter(response, session);
                        return new UseCase(presenter, ...useCaseContructorArgs);
                    },
                );
        } else {
            appContainer
                .bind<interfaces.Factory<TUseCase<TRequestModel>>>(symbolUseCaseFactory)
                .toFactory<TUseCase<TRequestModel>, [response: Signal<TViewModel>]>(
                    (context: interfaces.Context) => (response: Signal<TViewModel>) => {
                        const presenter = new Presenter(response);
                        return new UseCase(presenter, ...useCaseContructorArgs);
                    },
                );
        }
    }
}

export function loadFeaturesSync(appContainer: Container, features: IFeature[]) {
    for (const feature of features) {
        try {
            feature.load(appContainer);
        } catch (error) {
            console.error(`Error loading feature ${feature.name}: ${error}`);
            throw error;
        }
    }
}
