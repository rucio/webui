import { IronSession } from 'iron-session';
import { TUseCase } from './usecase';
import { Signal } from './web';

/**
 * A factory function that creates instances of a use case.
 * @param response The response object to use for the use case.
 * @param session An optional session object to use for the use case.
 * @returns An instance of the use case.
 */
type TUseCaseFactory<TRequestModel> = (response: Signal, session?: IronSession) => TUseCase<TRequestModel>;

export default TUseCaseFactory;
