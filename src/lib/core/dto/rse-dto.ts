import { BaseDTO, BaseStreamableDTO } from "@/lib/sdk/dto";
import { RSE } from "../entity/rucio";

/**
 * The Data Transfer Object for the ListRSEsEndpoint which contains the stream
 */
export interface ListRSEsDTO extends BaseStreamableDTO {}

/**
 * Data Transfer Object for GET RSE Endpoint
 */
export interface RSEDTO extends BaseDTO, RSE {}