import {
    BaseAuthenticatedInputPort,
    BaseInputPort,
    BaseMultiCallStreamableInputPort,
    BaseOutputPort,
    BaseStreamableInputPort,
    BaseStreamingOutputPort,
} from './primary-ports'
import {
    AuthenticatedRequestModel,
    BaseErrorResponseModel,
    BaseResponseModel,
} from './usecase-models'
import { Transform, TransformCallback, PassThrough, Readable } from 'stream'
import { BaseDTO, BaseStreamableDTO } from './dto'
import { BaseStreamingPostProcessingPipelineElement } from './usecase-stream-element'
import { BaseStreamingPresenter } from './presenter'

/**
 * A type that represents a simple use case that does not require authentication.
 * @typeparam TRequestModel The type of the request model for the use case.
 */
export type TBaseUseCase<TRequestModel> = BaseInputPort<TRequestModel>

/**
 * A type that represents an authenticated use case.
 * @typeparam TRequestModel The type of the request model for the use case.
 */
export type TAuthenticatedUseCase<TRequestModel> = BaseAuthenticatedInputPort<
    AuthenticatedRequestModel<TRequestModel>
>

/**
 * A type that represents a streamable use case. These usecases are always authenticated.
 * @typeparam TRequestModel The type of the request model for the use case.
 */
export type TStreamableUseCase<TRequestModel> = BaseStreamableInputPort<
    AuthenticatedRequestModel<TRequestModel>
>

/**
 * A type that represents any use case i.e {@link TBaseUseCase} or {@link TAuthenticatedUseCase} or {@link TStreamableUseCase}.
 * @typeparam TRequestModel The type of the request model for the use case.
 */
export type TUseCase<TRequestModel> =
    | TBaseUseCase<TRequestModel>
    | TAuthenticatedUseCase<TRequestModel>
    | TStreamableUseCase<TRequestModel>

/**
 * A base class for use cases.
 * @typeparam TRequestModel The type of the request model for the use case.
 * @typeparam TResponseModel The type of the response model for the use case.
 * @typeparam TErrorModel The type of the error model for the use case.
 * @typeparam TDTO The type of the DTO for the use case.
 */
export abstract class BaseUseCase<
    TRequestModel,
    TResponseModel extends BaseResponseModel,
    TErrorModel extends BaseErrorResponseModel,
    TDTO extends BaseDTO,
> {
    protected presenter: BaseOutputPort<TResponseModel, TErrorModel>

    /**
     * Creates a new instance of the `BaseUseCase` class.
     * @param presenter The output port that the use case will use to present the response or error model.
     */
    constructor(presenter: BaseOutputPort<TResponseModel, TErrorModel>) {
        this.presenter = presenter
    }

    /**
     * Validates the request model for the use case.
     * @param requestModel The request model to validate.
     * @returns An error model if the request model is invalid, or `undefined` if the request model is valid.
     */
    abstract validateRequestModel(
        requestModel: TRequestModel,
    ): TErrorModel | undefined

    /**
     * Makes a gateway request with the given request model.
     * @param requestModel The request model to send to the gateway.
     * @returns A promise that resolves with the DTO returned by the gateway.
     */
    abstract makeGatewayRequest(requestModel: TRequestModel): Promise<TDTO>

    /**
     * Handles a gateway error by converting it to an error model.
     * This method is called when the gateway returns a DTO with a status of `error`.
     * @param error The DTO returned by the gateway.
     * @returns An error model that represents the gateway error.
     */
    abstract handleGatewayError(error: TDTO): TErrorModel

    /**
     * Handles the DTO returned by the gateway.
     * This method is called when the gateway returns a DTO with a status of `success`.
     * @param dto The DTO returned by the gateway.
     * @returns An object that contains the response or error model and the status of processing the DTO.
     */
    abstract processDTO(dto: TDTO): {
        data: TResponseModel | TErrorModel
        status: 'success' | 'error'
    }

    /**
     * Processes the response and DTO returned by the gateway.
     * @param response The DTO returned by the gateway.
     * @returns The ResponseModel or ErrorModel returned, based on processing of the DTO.
     */
    processGatewayResponse(response: TDTO): TResponseModel | TErrorModel {
        if (response.status === 'success') {
            const { status, data } = this.processDTO(response)
            if (status === 'success') {
                return data as TResponseModel
            }
            return data as TErrorModel
        }
        const errorModel: TErrorModel = this.handleGatewayError(response)
        return errorModel
    }

    /**
     * Executes the use case with the given request model.
     * @param requestModel The request model for the use case.
     * @returns A promise that resolves when the use case has completed.
     */
    async execute(requestModel: TRequestModel): Promise<void> {
        const validationError: TErrorModel | undefined =
            this.validateRequestModel(requestModel)
        if (validationError) {
            this.presenter.presentError(validationError)
        }
        return this.makeGatewayRequest(requestModel)
            .then((response: TDTO) => {
                const data: TResponseModel | TErrorModel =
                    this.processGatewayResponse(response)
                if (data.status === 'success') {
                    this.presenter.presentSuccess(data)
                } else {
                    this.presenter.presentError(data)
                }
            })
            .catch((error: TDTO) => {
                const errorModel: TErrorModel = this.handleGatewayError(error)
                this.presenter.presentError(errorModel)
            })
    }
}

export abstract class BaseStreamingUseCase<
        TRequestModel,
        TResponseModel extends BaseResponseModel,
        TErrorModel extends BaseErrorResponseModel,
        TDTO extends BaseStreamableDTO,
        TStreamData,
    >
    extends Transform
    implements
        BaseStreamableInputPort<AuthenticatedRequestModel<TRequestModel>>
{
    protected presenter: BaseStreamingOutputPort<TResponseModel, TErrorModel>
    protected requestModel: AuthenticatedRequestModel<TRequestModel> | undefined

    constructor(
        presenter: BaseStreamingOutputPort<TResponseModel, TErrorModel>,
    ) {
        super({ objectMode: true })
        this.presenter = presenter
    }

    /**
     * Validates the request model for the use case.
     * @param requestModel The request model to validate.
     * @returns An error model if the request model is invalid, or `undefined` if the request model is valid.
     */
    abstract validateRequestModel(
        requestModel: AuthenticatedRequestModel<TRequestModel>,
    ): TErrorModel | undefined

    /**
     * Makes a gateway request with the given request model.
     * @param requestModel The request model to send to the gateway.
     * @returns A promise that resolves with the DTO returned by the gateway.
     */
    abstract makeGatewayRequest(
        requestModel: AuthenticatedRequestModel<TRequestModel>,
    ): Promise<TDTO>

    /**
     * Handles a gateway error by converting it to an error model.
     * @param error The DTO returned by the gateway.
     * @returns An error model that represents the gateway error.
     */
    abstract handleGatewayError(error: TDTO): TErrorModel

    /**
     * Processes individual streamed chunks of data from the gateway.
     * @param dto The streamed data from the gateway.
     * @returns An object that represents the processed data.
     */
    abstract processStreamedData(dto: TStreamData): {
        data: TResponseModel | TErrorModel
        status: 'success' | 'error'
    }

    setupStreamingPipeline(stream: Transform | Readable | PassThrough): void {
        stream.pipe(this)
        this.presenter.presentStream(this)
    }

    /**
     * Processes the DTO. Sets up the streaming pipeline if the DTO is valid.
     * @param response The DTO returned by the gateway.
     * @returns undefined if there were no errors, or an error model if there was an error.
     */
    processGatewayResponse(response: TDTO): undefined | TErrorModel {
        if (response.status === 'success') {
            const { stream } = response
            if (stream) {
                this.setupStreamingPipeline(stream)
                return undefined
            } else {
                return {
                    status: 'error',
                    message: 'No stream found in response',
                } as TErrorModel
            }
        } else {
            const errorModel: TErrorModel = this.handleGatewayError(response)
            return errorModel
        }
    }

    /**
     * Executes the use case with the given request model.
     */
    async execute(
        requestModel: AuthenticatedRequestModel<TRequestModel>,
    ): Promise<void> {
        this.requestModel = requestModel
        const validationError: TErrorModel | undefined =
            this.validateRequestModel(this.requestModel)
        if (validationError) {
            this.presenter.presentError(validationError)
        }
        const dto: TDTO = await this.makeGatewayRequest(this.requestModel)
        const error = this.processGatewayResponse(dto)
        if (error) {
            this.presenter.presentError(error as TErrorModel)
        }
    }

    _transform(
        dto: TStreamData,
        encoding: BufferEncoding,
        callback: TransformCallback,
    ): void {
        const { status, data } = this.processStreamedData(dto)
        if (status === 'success') {
            const responseModel = data as TResponseModel
            this.push(JSON.stringify(responseModel))
        } else {
            const errorModel = data as TErrorModel
            this.emit('error', JSON.stringify(errorModel))
        }
        callback()
    }
}

export class ResponseModelValidatorPipelineElement<TResponseModel extends BaseResponseModel, TErrorModel> extends Transform {
    constructor() {
        super({ objectMode: true })
    }

    validateResponseModel(responseModel: TResponseModel): {
        isValid: boolean
        errorModel?: TErrorModel | undefined
    } {
        const isValid = responseModel.status === 'success'
        const errorModel: TErrorModel = {
            name: 'Validation Error',
            status: 'error',
            message: 'responseModel is not valid',
        } as TErrorModel
        return {
            isValid: isValid,
            errorModel: isValid ? undefined : errorModel,
        }
    } 

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        const { responseModel } = chunk
        const validationResult = this.validateResponseModel(responseModel)
        if (validationResult.isValid) {
            callback(undefined, responseModel)
        } else {
            this.emit('error', validationResult.errorModel)
            callback(validationResult.errorModel as Error)
        }
    }
}
export abstract class BaseMultiCallStreamableUseCase<
        TRequestModel,
        TResponseModel extends BaseResponseModel,
        TErrorModel extends BaseErrorResponseModel,
        TDTO extends BaseStreamableDTO,
        TStreamData,
    >
    extends BaseStreamingUseCase<
        TRequestModel,
        TResponseModel,
        TErrorModel,
        TDTO,
        TStreamData
    >
    implements
        BaseMultiCallStreamableInputPort<
            AuthenticatedRequestModel<TRequestModel>,
            TResponseModel,
            TErrorModel
        >
{
    protected postProcessingPipelineElements: BaseStreamingPostProcessingPipelineElement<
        AuthenticatedRequestModel<TRequestModel>,
        TResponseModel,
        TErrorModel,
        any
    >[] = []
    protected finalResponseValidationTransform: Transform
    constructor(
        presenter: BaseStreamingPresenter<
            TResponseModel,
            TStreamData,
            TErrorModel
        >,
        postProcessingPipelineElements: BaseStreamingPostProcessingPipelineElement<
            AuthenticatedRequestModel<TRequestModel>,
            TResponseModel,
            TErrorModel,
            any
        >[],
    ) {
        super(presenter)
        this.postProcessingPipelineElements = postProcessingPipelineElements
        this.finalResponseValidationTransform = new ResponseModelValidatorPipelineElement<TResponseModel, TErrorModel>()
    }

    /**
     * Sets up the post processing pipeline.
     * @param pipelineElements
     * @override
     */
    setupStreamingPipeline(stream: Transform): void {
        // loop over pipeline elements and pipe them together. Pipe the last element to this object
        // for validation and pipe this to presenter
        const pipeline = [
            stream,
            this,
            ...this.postProcessingPipelineElements,
            this.finalResponseValidationTransform,
        ]
        for (let i = 1; i < pipeline.length; i++) {
            const pipelineElement = pipeline[i]
            const prevPipelineElement = pipeline[i - 1]
            prevPipelineElement
                .on('error', error =>
                    this.handleStreamError(error as TErrorModel),
                )
                .pipe(pipelineElement)
        }
        this.presenter.presentStream(this.finalResponseValidationTransform)
    }

    abstract validateFinalResponseModel(responseModel: TResponseModel): {
        isValid: boolean
        errorModel?: TErrorModel | undefined
    }
    abstract handleStreamError(error: TErrorModel): void

    _transform(
        dto: TStreamData,
        encoding: BufferEncoding,
        callback: TransformCallback,
    ): void {
        const { status, data } = this.processStreamedData(dto)
        if (status === 'success') {
            const responseModel = data as TResponseModel
            this.push(
                {
                    requestModel: this.requestModel,
                    responseModel: responseModel,
                },
            )
        } else {
            const errorModel = data as TErrorModel
            this.emit('error', errorModel)
        }
        callback()
    }
}
