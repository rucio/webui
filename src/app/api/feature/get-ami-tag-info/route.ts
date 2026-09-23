import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetAMITagInfoControllerParameters } from '@/lib/infrastructure/controller/get-ami-tag-info-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { MAX_AMI_TAGS_PER_REQUEST, parseAmiTagsParam } from '@/lib/core/utils/ami-tag-utils';

/**
 * GET /api/feature/get-ami-tag-info
 * Query params: tags (comma-separated AMI tags, e.g. f1723,m2281)
 * Returns AMI links and best-effort AMI details for each tag (ATLAS only, dids.ami_tags)
 */
async function getHandler(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const tags = parseAmiTagsParam(params.tags);

        if (!tags) {
            return NextResponse.json(
                { error: `Invalid parameter: tags must be 1 to ${MAX_AMI_TAGS_PER_REQUEST} comma-separated AMI tags` },
                { status: 400 },
            );
        }

        const controller = appContainer.get<BaseController<GetAMITagInfoControllerParameters, void>>(CONTROLLERS.GET_AMI_TAG_INFO);

        return executeAuthenticatedController(controller, { tags });
    } catch (error) {
        console.error('Error in get-ami-tag-info:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const GET = withFeature(CONTROLLERS.GET_AMI_TAG_INFO, getHandler);
