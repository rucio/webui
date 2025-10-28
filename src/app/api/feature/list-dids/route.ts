import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { DIDFilter, DIDFilterOperator } from '@/lib/core/entity/rucio';

/**
 * GET /api/feature/list-dids
 * Query params: query, type, filters (optional)
 * Returns a list of DIDs matching the query and type
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        console.log('Query Params:', params);
        const query = params.query as string;
        const type = params.type as string;
        const filters = params.filters;

        if (!query) {
            return NextResponse.json(
                { error: 'Missing required parameter: query' },
                { status: 400 }
            );
        }

        if (!type) {
            return NextResponse.json(
                { error: 'Missing required parameter: type' },
                { status: 400 }
            );
        }

        // Parse DID filters
        const didfilters = parseDIDFilters(filters);

        const controller = appContainer.get<BaseController<ListDIDsControllerParameters, void>>(
            CONTROLLERS.LIST_DIDS
        );
        return executeAuthenticatedController(controller, { query, type, filters: didfilters }, true);
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function parseDIDFilters(filters: string | string[] | undefined): DIDFilter[] {
    if (!filters) return [];

    const filtersArray = Array.isArray(filters) ? filters : [filters];

    return filtersArray.map(m => {
        // Match the first valid operator
        const operatorMatch = m.match(/(!=|>=|<=|>|<|=)/)?.[0] as DIDFilterOperator || '=';
        const operatorIndex = m.indexOf(operatorMatch);

        return {
            key: m.substring(0, operatorIndex),
            operator: operatorMatch,
            value: m.substring(operatorIndex + operatorMatch.length)
        };
    });
}
