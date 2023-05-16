import { DIDDTO } from "@/lib/core/data/rucio-dto";
import DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";

export default class RucioDIDGateway implements DIDGatewayOutputPort {
    listDIDs(scope: string, name: string, type: string): Promise<DIDDTO[]> {
        throw new Error("Method not implemented.");
    }
}