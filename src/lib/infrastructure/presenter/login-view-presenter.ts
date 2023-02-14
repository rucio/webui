import { NextApiResponse } from "next";
// import { LoginViewModel } from "../data/view-model/login";

// export default class LoginViewPresenter implements RenderLoginViewOutputPort<NextApiResponse> {
//     response: NextApiResponse;

//     constructor(response: NextApiResponse) {
//         this.response = response;
//     }

//     presentSuccess(responseModel: RenderLoginViewResponse) {
//         this.response.status(200).json(responseModel);
//     }

//     presentError(error: RenderLoginViewError) {
//         this.response.status(500).json(error);
//     }
// }