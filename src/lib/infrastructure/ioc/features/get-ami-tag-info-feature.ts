import { Container } from 'inversify';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import { GetAMITagInfoError, GetAMITagInfoRequest, GetAMITagInfoResponse } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';
import GetAMITagInfoController, { GetAMITagInfoControllerParameters } from '@/lib/infrastructure/controller/get-ami-tag-info-controller';
import GetAMITagInfoUseCase from '@/lib/core/use-case/get-ami-tag-info-usecase';
import GetAMITagInfoPresenter from '@/lib/infrastructure/presenter/get-ami-tag-info-presenter';
import { AMITagInfoViewModel } from '@/lib/infrastructure/data/view-model/ami';
import AMIGatewayOutputPort from '@/lib/core/port/secondary/ami-gateway-output-port';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export default class GetAMITagInfoFeature extends BaseFeature<
    GetAMITagInfoControllerParameters,
    GetAMITagInfoRequest,
    GetAMITagInfoResponse,
    GetAMITagInfoError,
    AMITagInfoViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const amiGateway = appContainer.get<AMIGatewayOutputPort>(GATEWAYS.AMI);
        const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_AMI_TAG_INFO,
            USECASE_FACTORY: USECASE_FACTORY.GET_AMI_TAG_INFO,
            INPUT_PORT: INPUT_PORT.GET_AMI_TAG_INFO,
        };
        super(
            'GetAMITagInfo',
            GetAMITagInfoController,
            GetAMITagInfoUseCase,
            [amiGateway, envConfigGateway],
            GetAMITagInfoPresenter,
            false,
            symbols,
            'dids.ami_tags',
        );
    }
}
