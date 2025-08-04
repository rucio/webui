import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller';
import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { MetaFilter, MetaOperator } from '@/lib/core/entity/rucio';

async function listDIDs(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    const { query, type, meta } = req.query;
    
    if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Missing query parameter' });
        return;
    }
    if (!type || typeof type !== 'string') {
        res.status(400).json({ error: 'Missing type parameter' });
        return;
    }

    // Parse meta filters
    const filters = parseMetaFilters(meta);

    const controller = appContainer.get<BaseController<ListDIDsControllerParameters, void>>(CONTROLLERS.LIST_DIDS);
    const controllerParameters: ListDIDsControllerParameters = {
            response: res,
            query: query as string,
            type: type as string,
            rucioAuthToken,
            filters
        };

        await controller.execute(controllerParameters);
    }

function parseMetaFilters(meta: string | string[] | undefined): MetaFilter[] {
    if (!meta) return [];
    
    const metaArray = Array.isArray(meta) ? meta : [meta];
    
    return metaArray.map(m => {
        // Match the first valid operator
        const operatorMatch = m.match(/(!=|>=|<=|>|<|=)/)?.[0] as MetaOperator || '=';
        const operatorIndex = m.indexOf(operatorMatch);
        
        return {
            key: m.substring(0, operatorIndex),
            operator: operatorMatch,
            value: m.substring(operatorIndex + operatorMatch.length)
        };
    });
}

export default withAuthenticatedSessionRoute(listDIDs);