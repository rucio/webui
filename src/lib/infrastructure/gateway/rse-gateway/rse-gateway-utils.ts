import { RSEDTO, RSEProtocolDTO } from '@/lib/core/dto/rse-dto';
import { RSEProtocol, RSEType } from '@/lib/core/entity/rucio';
/**
 * Represents the data returned by Rucio Server for a RSE.
 */
export type TRucioRSE = {
  id: string;
  rse: string;
  vo: string;
  rse_type: string;
  deterministic: boolean;
  volatile: boolean;
  staging_area: boolean;
  city: string | null;
  region_code: string | null;
  country_name: string | null;
  continent: string | null;
  time_zone: string | null;
  ISP: string | null;
  ASN: string | null;
  longitude: number | null;
  latitude: number | null;
  availability: number;
  availability_read: boolean;
  availability_write: boolean;
  availability_delete: boolean;
  qos_class: string | null;
  deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export type TRucioRSEProtocol = {
    domains: {
        [key: string]: {
          delete: number;
          read: number;
          third_party_copy_read?: number;
          third_party_copy_write?: number;
          write: number;
        };
      };
      extended_attributes: {
        space_token: string;
        web_service_path: string;
      } | null;
      hostname: string;
      impl: string;
      port: number;
      prefix: string;
      scheme: string;
}

/**
 * Converts a string representing the RSE Type to a {@link RSEType} enum value.
 * @param rseType A string representing the RSE Type
 * @returns {@link RSEType}
 */
function getRSEType(rseType: string): RSEType {
    switch(rseType.toUpperCase()) {
        case 'DISK':
            return RSEType.DISK
        case 'TAPE':
            return RSEType.TAPE
        default:
            return RSEType.UNKNOWN
    }
}

/**
 * @param rse The RSE of type {@link TRucioRSE} to convert to a DTO
 * @returns A {@link RSEDTO} object
 */
export function convertToRSEDTO(rse: TRucioRSE): RSEDTO {
    const dto: RSEDTO = {
        status: 'success',
        id: rse.id,
        name: rse.rse,
        rse_type: getRSEType(rse.rse_type),
        volatile: rse.volatile,
        deterministic: rse.deterministic,
        staging_area: rse.staging_area,
    }
    return dto
}

/**
 * Converts rucio server RSEProtocol to a {@link RSEProtocol} object.
 * @param protocol The RSE Protocol of type {@link TRucioRSEProtocol} to convert to a DTO
 * @param rseName The name of the RSE for which the protocols are being retrieved
 * @returns A {@link RSEProtocol} object
 */
export function covertToRSEProtocol(protocol: TRucioRSEProtocol, rseName: string): RSEProtocol {
    const domains = protocol.domains
    const rseProtocol: RSEProtocol = {
        rseid: rseName,
        scheme: protocol.scheme,
        hostname: protocol.hostname,
        port: protocol.port,
        prefix: protocol.prefix,
        impl: protocol.impl,
        priorities_lan: {
            read: domains.lan.read || 0,
            write: domains.lan.write || 0,
            delete: domains.lan.delete || 0,
        },
        priorities_wan: {
            read: domains.wan.read || 0,
            write: domains.wan.write || 0,
            delete: domains.wan.delete || 0,
            tpcread: domains.wan.third_party_copy_read || 0,
            tpcwrite: domains.wan.third_party_copy_write || 0,
        },

    }
    return rseProtocol
}