import { ListDIDDTO, DIDDTO } from "../../data/did-dto";
import { DIDType } from "../../entity/rucio";


export default interface DIDGatewayOutputPort {
    /**
     * Searches Rucio Server for expressions that match the scope:name pattern provided.
     * @param rucioAuthToken A valid rucio auth token
     * @param scope The scope of the DID
     * @param name The expression for the DID Name  ( supports wildcards )
     * @param type {@link DIDType} of the DID
     */
    listDIDs(rucioAuthToken: string, scope: string, name: string, type: DIDType): Promise<ListDIDDTO>

    /**
     * 
     * @param rucioAuthToken A valid rucio auth token
     * @param scope The scope of the DID
     * @param name The exact name of the DID
     */
    getDID(rucioAuthToken: string, scope: string, name: string): Promise<DIDDTO>
}