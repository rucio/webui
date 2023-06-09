import { IStreamPresenter } from "@/lib/common/stream/stream-presenter";
import { PassThrough } from "stream";
export interface IStreamUseCase<TResponseModel, TViewModel> {
    buffer: TViewModel[];
    startStream(stream: PassThrough): void;
    pushToPresenter(data: TResponseModel): void;
}


export default abstract class StreamingUseCase<TResponseModel, TViewModel, TErrorModel> implements IStreamUseCase<TResponseModel, TViewModel>{
    buffer: TViewModel[] = [];
    presenter: IStreamPresenter<TResponseModel, TViewModel, TErrorModel>;
    constructor(
        presenter: IStreamPresenter<TResponseModel, TViewModel, TErrorModel>
    ){
        this.presenter = presenter;
    }

    startStream(stream: PassThrough): void {
        stream.on('data', (data: TViewModel) => {
        });
        stream.on('end', () => {
            this.presenter.endStream();
        });
    }
    pushToPresenter(data: TResponseModel): void {
        this.presenter.streamSuccess(data);
    }

}