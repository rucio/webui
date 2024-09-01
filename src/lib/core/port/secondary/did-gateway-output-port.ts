import {
    ListDIDDTO,
    DIDExtendedDTO,
    DIDMetaDTO,
    ListDIDRulesDTO,
    DIDKeyValuePairsDTO,
    CreateDIDSampleDTO,
    AddDIDDTO,
    AttachDIDDTO as AttachDIDsDTO,
    SetDIDStatusDTO,
} from '../../dto/did-dto';
import { DID, DIDType } from '../../entity/rucio';

/**
 * Output port for the DID Gateway, responsible for defining the methods that the Gateway will use to interact with the Rucio Server.
 */
export default interface DIDGatewayOutputPort {
    /**
     * Sends a request to create a sample DID to the Rucio Server.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param inputScope The scope of the input DID.
     * @param inputName The name of the input DID.
     * @param outputScope The scope of the output DID.
     * @param outputName The name of the output DID.
     * @param nbFiles The number of files.
     * @returns A Promise that resolves to a {@link CreateDIDSampleDTO} object.
     */
    createDIDSample(
        rucioAuthToken: string,
        inputScope: string,
        inputName: string,
        outputScope: string,
        outputName: string,
        nbFiles: number,
    ): Promise<CreateDIDSampleDTO>;

    /**
     * Creates a new DID on the Rucio Server.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID
     * @param name The name of the DID
     * @param didType The DIDType of the DID
     */
    addDID(rucioAuthToken: string, scope: string, name: string, didType: DIDType): Promise<AddDIDDTO>;

    /**
     * Attaches a list of DIDs to a parent DID.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the parent DID
     * @param name The name of the parent DID
     * @param dids A list of DIDs to attach to the parent DID
     */
    attachDIDs(rucioAuthToken: string, scope: string, name: string, dids: DID[]): Promise<AttachDIDsDTO>;

    /**
     * Retrieves a DID from the Rucio Server.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The exact name of the DID.
     * @param dynamicDepth The depth until until which the length and bytes should be calculated. Optional.
     * @returns A Promise that resolves to a {@link DIDExtendedDTO} object.
     */
    getDID(rucioAuthToken: string, scope: string, name: string, dynamicDepth: DIDType.DATASET | DIDType.FILE | undefined): Promise<DIDExtendedDTO>;

    /**
     * Retrieves metadata for a DID from the Rucio Server.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The name of the DID.
     * @returns A Promise that resolves to a {@link DIDMetaDTO} object.
     */
    getDIDMeta(rucioAuthToken: string, scope: string, name: string): Promise<DIDMetaDTO>;

    /**
     * Retrieves key-value pairs for a DID from the Rucio Server.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The name of the DID.
     * @returns A Promise that resolves to a {@link DIDKeyValuePairsDTO} object.
     */
    getDIDKeyValuePairs(rucioAuthToken: string, scope: string, name: string): Promise<DIDKeyValuePairsDTO>;

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
    listDIDParents(rucioAuthToken: string, scope: string, name: string): Promise<ListDIDDTO>;

    /**
     * Retrieves a list of DIDs from the Rucio Server.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The name of the DID.
     * @param type The {@link DIDType} of the DID.
     * @returns A Promise that resolves to a {@link ListDIDDTO} object.
     */
    listDIDs(rucioAuthToken: string, scope: string, name: string, type: DIDType): Promise<ListDIDDTO>;

    /**
     * Retrieves a list of replication rules for a given DID.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The name of the DID.
     * @returns A Promise that resolves to a {@link ListDIDRulesDTO} object.
     */
    listDIDRules(rucioAuthToken: string, scope: string, name: string): Promise<ListDIDRulesDTO>;

    /**
     * Retrieves a list of DIDs that are contained within the given DID.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID.
     * @param name The name of the DID.
     */
    listDIDContents(rucioAuthToken: string, scope: string, name: string): Promise<ListDIDDTO>;

    /**
     * Sets a DID status to open or closed.
     * @param rucioAuthToken A valid Rucio auth token.
     * @param scope The scope of the DID whose status is to be changed.
     * @param name The name of the DID whose status is to be changed.
     * @param open A boolean value indicating whether the DID should be open or closed.
     */
    setDIDStatus(rucioAuthToken: string, scope: string, name: string, open: boolean): Promise<SetDIDStatusDTO>;
}
