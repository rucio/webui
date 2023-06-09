import { ListDIDsRequest } from "@/lib/core/data/usecase-models/list-dids-usecase-models";
import { DIDType } from "@/lib/core/entity/rucio";
import ListDIDsInputPort from "@/lib/core/port/primary/list-dids-input-port";
import { injectable, inject } from "inversify";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "../config/ioc/ioc-symbols-usecase-factory";

export interface IListDIDsController {
    listDIDs(response: NextApiResponse, rucioAuthToken: string, query: string, type: string): void;
}

@injectable()
class ListDIDsController implements IListDIDsController {
    private listDIDsUseCase: ListDIDsInputPort | null = null;
    private listDIDsUseCaseFactory: (response: NextApiResponse) => ListDIDsInputPort;

    public constructor(
        @inject(USECASE_FACTORY.LIST_DIDS) listDIDsUseCaseFactory: (response: NextApiResponse) => ListDIDsInputPort,
        ) {
        this.listDIDsUseCaseFactory = listDIDsUseCaseFactory;
    }

    async listDIDs(response: NextApiResponse, rucioAuthToken: string, query: string, type: string) {
        this.listDIDsUseCase = this.listDIDsUseCaseFactory(response);
        type = type.toLowerCase();
        let did_type = DIDType.ALL;
        switch(type) {
            case 'container': {
                did_type = DIDType.CONTAINER;
            }
            case 'dataset': {
                did_type = DIDType.DATASET;
                break;
            }
            case 'file': {
                did_type = DIDType.FILE;
                break;
            }
            default: {
                did_type = DIDType.ALL;
            }
        }
        const requestModel: ListDIDsRequest = {
            query: query,
            type: did_type,
            rucioAuthToken: rucioAuthToken
        }
        await this.listDIDsUseCase.execute(requestModel);
    }
}

export default ListDIDsController;