import { BaseDTO, BaseStreamableDTO } from "@/lib/sdk/dto";
import { RSE, RSEAttribute, RSEProtocol } from "@/lib/core/entity/rucio";

/**
 * The Data Transfer Object for the ListRSEsEndpoint which contains the stream
 */
export interface ListRSEsDTO extends BaseStreamableDTO {}

/**
 * Data Transfer Object for GET RSE Endpoint
 */
export interface RSEDTO extends BaseDTO, RSE {}

/**
 * Data Transfer Object for GET RSE Protocols Endpoint
 */
export interface RSEProtocolDTO extends BaseDTO {
    protocols: RSEProtocol[]
}

/**
 * Data Transfer Object for GET RSE Attributes Endpoint
 */
export interface RSEAttributeDTO extends BaseDTO {
    attributes: RSEAttribute[]
}