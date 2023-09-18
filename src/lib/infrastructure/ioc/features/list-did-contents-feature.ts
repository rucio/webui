import DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port"
import {
    ListDIDContentsError,
    ListDIDContentsRequest,
    ListDIDContentsResponse,
} from "@/lib/core/usecase-models/list-did-contents-usecase-models"
import { ListDIDContentsControllerParameters } from "@/lib/infrastructure/controller/list-did-contents-controller"
import ListDIDContentsController from "@/lib/infrastructure/controller/list-did-contents-controller"
import { DIDViewModel } from "@/lib/infrastructure/data/view-model/did"
import {
    BaseStreamableFeature,
    IOCSymbols,
} from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'

import ListDIDContentsUseCase from "@/lib/core/use-case/list-did-contents-usecase"

import ListDIDContentsPresenter from "@/lib/infrastructure/presenter/list-did-contents-presenter"



export default class ListDIDContentsFeature extends BaseStreamableFeature<
    ListDIDContentsControllerParameters,
    ListDIDContentsRequest,
    ListDIDContentsResponse,
    ListDIDContentsError,
    DIDViewModel
> {
    constructor(appContainer: Container) {
        const didGateway = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_DID_CONTENTS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_DID_CONTENTS,
            INPUT_PORT: INPUT_PORT.LIST_DID_CONTENTS,
        }
        const useCaseConstructorArgs = [
            didGateway,
            
        ]
        super(
            'ListDIDContents',
            ListDIDContentsController,
            ListDIDContentsUseCase,
            useCaseConstructorArgs,
            ListDIDContentsPresenter,
            false,
            symbols
        )
    }
}