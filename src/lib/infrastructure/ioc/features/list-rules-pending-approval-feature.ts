import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import {
    ListRulesPendingApprovalError,
    ListRulesPendingApprovalRequest,
    ListRulesPendingApprovalResponse,
} from '@/lib/core/usecase-models/list-rules-pending-approval-usecase-models';
import { ListRulesPendingApprovalControllerParameters } from '@/lib/infrastructure/controller/list-rules-pending-approval-controller';
import ListRulesPendingApprovalController from '@/lib/infrastructure/controller/list-rules-pending-approval-controller';
import { BaseStreamableFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import ListRulesPendingApprovalUseCase from '@/lib/core/use-case/list-rules-pending-approval/list-rules-pending-approval-usecase';
import ListRulesPendingApprovalPresenter from '@/lib/infrastructure/presenter/list-rules-pending-approval-presenter';
import { ApproveRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';

export default class ListRulesPendingApprovalFeature extends BaseStreamableFeature<
    ListRulesPendingApprovalControllerParameters,
    ListRulesPendingApprovalRequest,
    ListRulesPendingApprovalResponse,
    ListRulesPendingApprovalError,
    ApproveRuleViewModel
> {
    constructor(appContainer: Container) {
        const ruleGateway = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const didGateway = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_RULES_PENDING_APPROVAL,
            USECASE_FACTORY: USECASE_FACTORY.LIST_RULES_PENDING_APPROVAL,
            INPUT_PORT: INPUT_PORT.LIST_RULES_PENDING_APPROVAL,
        };
        const useCaseConstructorArgs = [ruleGateway, didGateway];
        super(
            'ListRulesPendingApproval',
            ListRulesPendingApprovalController,
            ListRulesPendingApprovalUseCase,
            useCaseConstructorArgs,
            ListRulesPendingApprovalPresenter,
            false,
            symbols,
        );
    }
}
