import ReplicaGatewayOutputPort from "@/lib/core/port/secondary/replica-gateway-output-port"
import {
    ListDatasetReplicasError,
    ListDatasetReplicasRequest,
    ListDatasetReplicasResponse,
} from "@/lib/core/usecase-models/list-dataset-replicas-usecase-models"
import { ListDatasetReplicasControllerParameters } from "@/lib/infrastructure/controller/list-dataset-replicas-controller"
import ListDatasetReplicasController from "@/lib/infrastructure/controller/list-dataset-replicas-controller"
import { DIDDatasetReplicasViewModel } from "@/lib/infrastructure/data/view-model/did"
import {
    BaseStreamableFeature,
    IOCSymbols,
} from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'

import ListDatasetReplicasUseCase from "@/lib/core/use-case/list-dataset-replicas-usecase"

import ListDatasetReplicasPresenter from "@/lib/infrastructure/presenter/list-dataset-replicas-presenter"



export default class ListDatasetReplicasFeature extends BaseStreamableFeature<
    ListDatasetReplicasControllerParameters,
    ListDatasetReplicasRequest,
    ListDatasetReplicasResponse,
    ListDatasetReplicasError,
    DIDDatasetReplicasViewModel
> {
    constructor(appContainer: Container) {
        const replicaGateway = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_DATASET_REPLICAS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_DATASET_REPLICAS,
            INPUT_PORT: INPUT_PORT.LIST_DATASET_REPLICAS,
        }
        const useCaseConstructorArgs = [
            replicaGateway,
        ]
        super(
            'ListDatasetReplicas',
            ListDatasetReplicasController,
            ListDatasetReplicasUseCase,
            useCaseConstructorArgs,
            ListDatasetReplicasPresenter,
            false,
            symbols
        )
    }
}