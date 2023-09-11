import { ListDIDDTO, DIDDTO, DIDMetaDTO, ListDIDRulesDTO, DIDKeyValuePairsDTO } from "../../dto/did-dto";
import { DIDType } from "../../entity/rucio";


/**
 * Output port for the DID Gateway, responsible for defining the methods that the Gateway will use to interact with the Rucio Server.
 */
export default interface DIDGatewayOutputPort {
    /**
     * Retrieves a DID from the Rucio Server.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The exact name of the DID.
     * @returns A Promise that resolves to a {@link DIDDTO} object.
     */
    getDID(rucioAuthToken: string, scope: string, name: string): Promise<DIDDTO>
    
    /**
     * Retrieves metadata for a DID from the Rucio Server.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The name of the DID.
     * @returns A Promise that resolves to a {@link DIDMetaDTO} object.
     */
    getDIDMeta(rucioAuthToken: string, scope: string, name: string): Promise<DIDMetaDTO>
    
    /**
     * Retrieves key-value pairs for a DID from the Rucio Server.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The name of the DID.
     * @returns A Promise that resolves to a {@link DIDKeyValuePairsDTO} object.
     */
    getDIDKeyValuePairs(rucioAuthToken: string, scope: string, name: string): Promise<DIDKeyValuePairsDTO>

    /**
     * Searches the Rucio Server for DIDs that match the provided expression.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The expression for the DID name (supports wildcards).
     * @param type The {@link DIDType} of the DID.
     */

    /**
     * Retrieves a list of parent DIDs for a given DID.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The name of the DID.
     * @returns A Promise that resolves to a {@link ListDIDDTO} object.
     */
    listDIDParents(rucioAuthToken: string, scope: string, name: string): Promise<ListDIDDTO>

    /**
     * Retrieves a list of DIDs from the Rucio Server.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The name of the DID.
     * @param type The {@link DIDType} of the DID.
     * @returns A Promise that resolves to a {@link ListDIDDTO} object.
     */
    listDIDs(rucioAuthToken: string, scope: string, name: string, type: DIDType): Promise<ListDIDDTO>

    /**
     * Retrieves a list of replication rules for a given DID.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The name of the DID.
     * @returns A Promise that resolves to a {@link ListDIDRulesDTO} object.
     */
    listDIDRules(rucioAuthToken: string, scope: string, name: string): Promise<ListDIDRulesDTO>
}