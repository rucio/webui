import { ListDIDDTO, DIDDTO, DIDMetaDTO, DIDKeyValuePairsDTO } from "../../dto/did-dto";
import { DIDType } from "../../entity/rucio";


export default interface DIDGatewayOutputPort {
    /**
     * 
     * @param rucioAuthToken A valid rucio auth token
     * @param scope The scope of the DID
     * @param name The exact name of the DID
     */
    getDID(rucioAuthToken: string, scope: string, name: string): Promise<DIDDTO>
    
    /**
     * Returns a selection of metadata in an object
     * @param rucioAuthToken A valid rucio auth token
     * @param scope The scope of the DID
     * @param name The name of the DID
     */
    getDIDMeta(rucioAuthToken: string, scope: string, name: string): Promise<DIDMetaDTO>
    
    /**
     * Returns the key value pairs for the DID as a list (sourced from rucio meta)
     * @param rucioAuthToken A valid rucio auth token
     * @param scope The scope of the DID
     * @param name The name of the DID
     */
    getDIDKeyValuePairs(rucioAuthToken: string, scope: string, name: string): Promise<DIDKeyValuePairsDTO>

    /**
     * Searches Rucio Server for expressions that match the scope:name pattern provided.
     * @param rucioAuthToken A valid rucio auth token
     * @param scope The scope of the DID
     * @param name The expression for the DID Name  ( supports wildcards )
     * @param type {@link DIDType} of the DID
     */
    listDIDs(rucioAuthToken: string, scope: string, name: string, type: DIDType): Promise<ListDIDDTO>

}