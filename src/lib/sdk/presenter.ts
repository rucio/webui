import { TWebResponse } from './web'
import { Transform, TransformCallback } from 'stream'
import { BaseOutputPort, BaseStreamingOutputPort } from './primary-ports'
import { NextApiResponse } from 'next'
import { IronSession } from 'iron-session'
import { BaseErrorResponseModel, BaseResponseModel } from './usecase-models'
import { BaseViewModel } from './view-models'
import { pipeline } from 'stream'
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
 * @typeparam TErrorModel The type of the error model to present.
 * @typeparam TStreamViewModel The type of the view model to present.
 */
export abstract class BaseStreamingPresenter<
        TResponseModel extends BaseResponseModel,
        TErrorModel extends BaseErrorResponseModel,
        TStreamViewModel extends BaseViewModel,
    >
    extends Transform
    implements BaseStreamingOutputPort<TResponseModel, TErrorModel, TStreamViewModel>
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
        viewModel: TStreamViewModel
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
    abstract streamResponseModelToViewModel(
        responseModel: TResponseModel,
    ): TStreamViewModel

    /**
     * Convert an error that occurred for a given stream element to a view model.
     * @param error An ErrorResponseModel that represents the error that occurred for a given stream element.
     */
    abstract streamErrorModelToViewModel(error: TErrorModel): TStreamViewModel
    
    /**
     * Presents a stream of response models.
     * @param stream The stream of response models to present.
     * @returns A promise that resolves when the stream has been fully presented.
     */
    setupStream(stream: TWebResponse) {
        // pipeline(stream as Transform, this, (error) => {
        //     throw new Error("Not Implemented. Expose error as a ViewModel instead.")
        // })

        // pipeline(this, this.response, (error) => {
        //     throw new Error("Not Implemented. Expose error as a ViewModel instead.")
        // })
        stream.pipe(this).pipe(this.response)
    }

    _transform(
        chunk: TResponseModel | TErrorModel,
        encoding: BufferEncoding,
        callback: TransformCallback,
    ): void {
        try {
            if(typeof chunk === 'string') chunk = JSON.parse(chunk)
            
            const responseModel: TResponseModel | TErrorModel = chunk
            if(responseModel.status === 'success'){
                const viewModel =
                this.streamResponseModelToViewModel(responseModel)
                callback(null, JSON.stringify(viewModel) + "\n")
            } else if(responseModel.status === 'error'){
                const viewModel = this.streamErrorModelToViewModel(responseModel as unknown as TErrorModel)
                callback(null, JSON.stringify(viewModel) + "\n")
            } else {
                callback(null)
            }
        } catch (error) {
            // If an error occurs while processing response or error models, we need to handle it here.
            callback(null, {
                status: 'error',
                message: `The presenter returned with an error while in pipeline element ${this.constructor.name}. Error: ${error}}`,
            } as TStreamViewModel)      
        }
    }

    _flush(callback: TransformCallback): void {
        callback()
    }
}
