import { ListReplicasDTO } from "@/lib/core/dto/replica-dto";
import { BaseStreamableEndpoint } from "@/lib/sdk/gateway-endpoints";

export default class ListReplicasEndpoint extends BaseStreamableEndpoint<ListReplicasDTO, FileReplicaStateDTO>