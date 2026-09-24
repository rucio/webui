import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetPandaTaskLinkControllerParameters } from '@/lib/infrastructure/controller/get-panda-task-link-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { isPandaTaskId } from '@/lib/core/utils/panda-task-utils';

/**
 * GET /api/feature/get-panda-task-link
 * Query params: taskId (PanDA/JEDI task id, 1 to 12 digits)
 * Returns the BigPanDA link for the task (ATLAS only, dids.panda_task)
 */
async function getHandler(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const taskId = typeof params.taskId === 'string' ? params.taskId : '';

        if (!isPandaTaskId(taskId)) {
            return NextResponse.json({ error: 'Invalid parameter: taskId must be 1 to 12 digits' }, { status: 400 });
        }

        // The feature is only loaded when the flag was on at startup; if it was
        // switched on later without a restart, answer like a disabled feature.
        if (!appContainer.isBound(CONTROLLERS.GET_PANDA_TASK_LINK)) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const controller = appContainer.get<BaseController<GetPandaTaskLinkControllerParameters, void>>(CONTROLLERS.GET_PANDA_TASK_LINK);

        return executeAuthenticatedController(controller, { taskId });
    } catch (error) {
        console.error('Error in get-panda-task-link:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const GET = withFeature(CONTROLLERS.GET_PANDA_TASK_LINK, getHandler);
