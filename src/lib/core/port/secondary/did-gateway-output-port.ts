import { DIDDTO, DIDType } from "../../data/rucio-dto";

export default interface DIDGatewayOutputPort {
    /**
     * Searches Rucio Server for expressions that match the scope:name pattern provided.
     * @param scope The scope of the DID
     * @param name The expression for the DID Name  ( supports wildcards )
     * @param type {@link DIDType} of the DID
     */
    listDIDs(scope: string, name: string, type: DIDType): Promise<DIDDTO[]>
}