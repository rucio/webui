import { TWebResponse } from './web'
import { Transform, TransformCallback } from 'stream'
import { BaseOutputPort, BaseStreamingOutputPort } from './primary-ports'

/**
 * A base class for presenters.
 * @typeparam TResponseModel The type of the response model to present.
 * @typeparam TViewModel The type of the view model to present.
 * @typeparam TErrorModel The type of the error model to present.
 */
export abstract class BasePresenter<TResponseModel, TViewModel, TErrorModel>
    implements BaseOutputPort<TResponseModel, TViewModel, TErrorModel>
{
    response: TWebResponse
    
    constructor(response: TWebResponse) {
        this.response = response
    }

    /**
     * Presents a successful response model.
     * @param responseModel The response model to present.
     * @returns A promise that resolves to the view model.
     */
    abstract presentSuccess(responseModel: TResponseModel): Promise<TViewModel>
    
    /**
     * Presents an error model.
     * @param errorModel The error model to present.
     * @returns A promise that resolves to the view model.
     */
    abstract presentError(errorModel: TErrorModel): Promise<TViewModel>
}

/**
 * A base class for streaming presenters.
 * @typeparam TResponseModel The type of the response model to present.
 * @typeparam TViewModel The type of the view model to present.
 * @typeparam TErrorModel The type of the error model to present.
 */
export abstract class BaseStreamingPresenter<
        TResponseModel,
        TViewModel,
        TErrorModel,
    >
    extends Transform
    implements BaseStreamingOutputPort<TResponseModel, TViewModel, TErrorModel>
{
    response: TWebResponse
    constructor(response: TWebResponse) {
        super({ objectMode: true })
        this.response = response
    }

    /**
     * Presents an error model.
     * @param errorModel The error model to present.
     * @returns A promise that resolves when the error has been presented.
     */
    abstract presentError(errorModel: TErrorModel): Promise<void>

    /**
     * Converts a response model to a view model.
     * @param responseModel The response model to convert.
     * @returns The converted view model.
     * @throws An error if the response model cannot be converted.
     * @remarks This method is called for each response model in a stream.
     * @remarks This method is called by the `_transform` method.
     */
    abstract convertResponseModelToViewModel(
        responseModel: TResponseModel,
    ): TViewModel

    /**
     * Presents a stream of response models.
     * @param stream The stream of response models to present.
     * @returns A promise that resolves when the stream has been fully presented.
     */
    async presentStream(stream: TWebResponse): Promise<void> {
        stream.pipe(this).pipe(this.response)
    }

    _transform(
        chunk: any,
        encoding: BufferEncoding,
        callback: TransformCallback,
    ): void {
        try {
            const responseModel = JSON.stringify(
                chunk.toString(),
            ) as TResponseModel
            const viewModel =
                this.convertResponseModelToViewModel(responseModel)
            this.push(viewModel)
        } catch (error) {
            this.emit('error', error)
        } finally {
            callback()
        }
    }

    _flush(callback: TransformCallback): void {
        callback()
    }
}
