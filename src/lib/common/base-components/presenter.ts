import {
    BaseOutputPort,
    BaseStreamingOutputPort,
} from '@/lib/common/base-components/primary-ports'

/**
 * A base interface for presenters.
 * @typeparam TResponseModel The type of the response model to present.
 * @typeparam TViewModel The type of the view model to present.
 * @typeparam TErrorModel The type of the error model to present.
 */
export type BasePresenter<TResponseModel, TViewModel, TErrorModel> =
    BaseOutputPort<TResponseModel, TViewModel, TErrorModel>

/**
 * A base interface for streaming presenters.
 * @typeparam TViewModel The type of the view model to present.
 * @typeparam TErrorModel The type of the error model to present.
 */
export type BaseStreamingPresenter<TViewModel, TErrorModel> =
    BaseStreamingOutputPort<TViewModel, TErrorModel>
