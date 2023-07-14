import { TWebResponse } from './web'
import { Transform, TransformCallback } from 'stream'
import { BaseOutputPort, BaseStreamingOutputPort } from './primary-ports'
import { NextApiResponse } from 'next'
import { IronSession } from 'iron-session'
import { BaseErrorResponseModel, BaseResponseModel } from './usecase-models'
import { BaseViewModel } from './view-models'

/**
 * A base class for presenters.
 * @typeparam TResponseModel The type of the response model to present.
 * @typeparam TViewModel The type of the view model to present.
 * @typeparam TErrorModel The type of the error model to present.
 */
export abstract class BasePresenter<TResponseModel, TErrorModel, TViewModel>
    implements BaseOutputPort<TResponseModel, TErrorModel>
{
    response: NextApiResponse
    session: IronSession | undefined
    
    constructor(response: NextApiResponse, session?: IronSession) {
        this.response = response
        this.session = session
    }

    /**
     * Converts a response model to a view model.
     * @param responseModel The response model to convert.
     * @returns The view model that represents the response model.
     */
    abstract convertResponseModelToViewModel(responseModel: TResponseModel): {
        viewModel: TViewModel,
        status: number
    }
    
    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
    abstract convertErrorModelToViewModel(errorModel: TErrorModel): {
        viewModel: TViewModel,
        status: number
    }

    /**
     * Presents a successful response model.
     * @param responseModel The response model to present.
     * @returns A promise that resolves to the view model.
     */
    async presentSuccess(responseModel: TResponseModel): Promise<void> {
        const { viewModel, status } = this.convertResponseModelToViewModel(responseModel)
        await this.response.status(status).json(viewModel)
        return Promise.resolve()
    }
    
    /**
     * Presents an error model.
     * @param errorModel The error model to present.
     * @returns A promise that resolves to the view model.
     */
    async presentError(errorModel: TErrorModel): Promise<void> {
        const { status, viewModel } = this.convertErrorModelToViewModel(errorModel)
        await this.response.status(status).json(viewModel)
        return Promise.resolve()
    }
}

/**
 * A base class for streaming presenters.
 * @typeparam TResponseModel The type of the response model to present.
 * @typeparam TViewModel The type of the view model to present.
 * @typeparam TErrorModel The type of the error model to present.
 */
export abstract class BaseStreamingPresenter<
        TResponseModel extends BaseResponseModel,
        TErrorModel extends BaseErrorResponseModel,
        TViewModel extends BaseViewModel,
    >
    extends Transform
    implements BaseStreamingOutputPort<TResponseModel, TErrorModel, TViewModel>
{
    response: TWebResponse
    constructor(response: TWebResponse) {
        super({ objectMode: true })
        this.response = response
    }
    
    /**
     * Converts an error model to view model.
     * @param errorModel 
     * @returns The converted view model and the HTTP status code for the final HTTP response.
     */
    abstract convertErrorModelToViewModel(errorModel: TErrorModel): {
        status: number,
        viewModel: TViewModel
    }
    
    /**
     * Presents an error model.
     * @param errorModel The error model to present.
     * @returns A promise that resolves when the error has been presented.
     */
    presentError(errorModel: TErrorModel): void {
        const response = this.response as NextApiResponse
        const { status, viewModel } = this.convertErrorModelToViewModel(errorModel)
        response.status(status).json(viewModel)
        return;
    }

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

    handleStreamError(error: TErrorModel){
        this.emit('error', error)
        throw error
    }
    /**
     * Presents a stream of response models.
     * @param stream The stream of response models to present.
     * @returns A promise that resolves when the stream has been fully presented.
     */
    presentStream(stream: TWebResponse) {
        stream.on('error', (error) => { this.handleStreamError(error as TErrorModel) })
        .pipe(this).on('error', (error) => { this.handleStreamError(error as TErrorModel) })
        .pipe(this.response)
    }

    _transform(
        chunk: TResponseModel,
        encoding: BufferEncoding,
        callback: TransformCallback,
    ): void {
        try {
            const responseModel: TResponseModel = chunk
            const viewModel =
                this.convertResponseModelToViewModel(responseModel)
            callback(undefined, JSON.stringify(viewModel))
        } catch (error) {
            this.emit('error', error)
            callback(error as Error)
        }
    }

    _flush(callback: TransformCallback): void {
        callback()
    }
}
