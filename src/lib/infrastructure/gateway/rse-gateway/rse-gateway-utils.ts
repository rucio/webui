import { RSEDTO } from '@/lib/core/dto/rse-dto';
import { RSEType } from '@/lib/core/entity/rucio';
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