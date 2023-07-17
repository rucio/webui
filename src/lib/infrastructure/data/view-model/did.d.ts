import { DID, DIDMeta } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface DIDViewModel extends DID {}

export interface DIDMetaViewModel extends DIDMeta, BaseViewModel {}