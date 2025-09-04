import { BaseInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { LoginConfigError, LoginConfigResponse } from '../../usecase-models/login-config-usecase-models';

/**
 * @interface LoginConfigInputPort to fetch the login page configuration from the backend.
 * This is implemented by {@link LoginConfigUseCase}
 */
export interface LoginConfigInputPort extends BaseInputPort<void> {}

/**
 * Defines the output port for the login config use case. This interface muse be implemented by the
 * Presenter for the login config use case. {@type T} is the type of the presenter i.e. HTTPResponse or other.
 */
export interface LoginConfigOutputPort extends BaseOutputPort<LoginConfigResponse, LoginConfigError> {}
