import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListRuleReplicaLockStatesControllerParameters } from '@/lib/infrastructure/controller/list-rule-replica-lock-states-controller';
import { ListRuleReplicaLockStatesRequest } from '@/lib/core/usecase-models/list-rule-replica-lock-states-usecase-models';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/list-rule-replica-lock-states
 * Query params: id (rule_id)
 * Returns the replica lock states for a given rule
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const id = params.id as string;

        if (!id) {
            return NextResponse.json(
                { error: 'Missing required parameter: id (rule ID)' },
                { status: 400 }
            );
        }

        const controller = appContainer.get<BaseController<ListRuleReplicaLockStatesControllerParameters, ListRuleReplicaLockStatesRequest>>(
            CONTROLLERS.LIST_RULE_REPLICA_LOCK_STATES
        );

        return executeAuthenticatedController(controller, { id }, true);
    } catch (error) {
        console.error('Error in list-rule-replica-lock-states:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
