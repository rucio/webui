import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller';
import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { DIDFilter, DIDFilterOperator } from '@/lib/core/entity/rucio';

async function listDIDs(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    const { query, type, filters } = req.query;
    
    if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Missing query parameter' });
        return;
    }
    if (!type || typeof type !== 'string') {
        res.status(400).json({ error: 'Missing type parameter' });
        return;
    }

    // Parse DID filters
    const didfilters = parseDIDFilters(filters);

    const controller = appContainer.get<BaseController<ListDIDsControllerParameters, void>>(CONTROLLERS.LIST_DIDS);
    const controllerParameters: ListDIDsControllerParameters = {
            response: res,
            query: query as string,
            type: type as string,
            rucioAuthToken,
            filters: didfilters
        };

        await controller.execute(controllerParameters);
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

export default withAuthenticatedSessionRoute(listDIDs);