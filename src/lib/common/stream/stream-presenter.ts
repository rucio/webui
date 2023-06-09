import { NextApiResponse } from 'next';

export interface IStreamPresenter<TResponseModel, TViewModel, TErrorModel> {
    streamSuccess(responseModel: TResponseModel): Promise<void>;
    presentError(error: TErrorModel): Promise<void>;
    prepareSuccessViewModel(responseModel: TResponseModel): TViewModel | Promise<TViewModel>;
    endStream(): Promise<void>;
}

export default abstract class StreamPresenter<TResponseModel, TViewModel, TErrorModel>  implements IStreamPresenter<TResponseModel, TViewModel, TErrorModel>{
    response: NextApiResponse<any>;
    constructor(response: NextApiResponse) {
        this.response = response;
    }

    abstract prepareSuccessViewModel(responseModel: TResponseModel): TViewModel | Promise<TViewModel>;
    abstract presentError(error: TErrorModel): Promise<void>

    async streamSuccess(responseModel: TResponseModel) {
        const viewModel: TViewModel = await this.prepareSuccessViewModel(responseModel);
        this.response.write(viewModel);
    }


    async endStream(){
        this.response.end();
    }
}