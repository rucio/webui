import { FileReplicaStateDTO, ListReplicasDTO } from "@/lib/core/dto/replica-dto";
import { BaseStreamableEndpoint } from "@/lib/sdk/gateway-endpoints";
import { Response } from "node-fetch";

/**
 * Lists replicas for a given File DID via Streaming
 */
export default class ListFileReplicasEndpoint extends BaseStreamableEndpoint<ListReplicasDTO, FileReplicaStateDTO>{
    reportErrors(statusCode: number, response: Response): Promise<ListReplicasDTO | undefined> {
        throw new Error("Method not implemented.");
    }
    createDTO(response: Buffer): FileReplicaStateDTO {
        throw new Error("Method not implemented.");
    }
}

// ListFilesInDataSetEndpoint()