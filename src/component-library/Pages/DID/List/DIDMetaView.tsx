import { DIDTypeTag } from '../../../Tags/DIDTypeTag';
import { BoolTag } from '../../../Tags/BoolTag';
import { twMerge } from 'tailwind-merge';
import { AvailabilityTag } from '../../../Tags/AvailabilityTag';
import { FileSize } from '../../../Text/Content/FileSize';
import { DIDMetaViewModel } from '@/lib/infrastructure/data/view-model/did';
var format = require('date-format');

export const DIDMetaView = (props: { data: DIDMetaViewModel; show: boolean; horizontal?: boolean }) => {
    const Titletd: React.FC<JSX.IntrinsicElements['td']> = ({ ...props }) => {
        const { className, ...otherprops } = props;
        return (
            <td className={twMerge('font-bold w-32 pl-1 dark:text-text-0', className ?? '')} aria-label="Key" {...otherprops}>
                {props.children}
            </td>
        );
    };
    const Contenttd: React.FC<JSX.IntrinsicElements['td']> = ({ ...props }) => {
        const { className, ...otherprops } = props;
        return (
            <td className={twMerge('break-all dark:text-text-100', className ?? '')} aria-label="Value" {...otherprops}>
                {props.children}
            </td>
        );
    };
    const meta = props.data;
    // suspense: data is not loaded yet
    if (props.data.status === 'pending') {
        return (
            <div
                className={twMerge(
                    !props.horizontal ?? false ? 'flex flex-col space-y-2' : 'grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2 gap-y-2',
                    props.show ? '' : 'hidden',
                )}
                aria-label="DID Metadata Quick Summary -- Loading"
                aria-busy="true"
            >
                Loading DID Metadata
            </div>
        );
    }
    // base case: data is loaded
    return (
        <div
            className={twMerge(
                !props.horizontal ?? false ? 'flex flex-col space-y-2' : 'grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2 gap-y-2',
                props.show ? '' : 'hidden',
            )}
            aria-label="DID Metadata Quick Summary"
        >
            <table
                className={twMerge('bg-neutral-0 dark:bg-neutral-700', 'w-full rounded border-separate border-spacing-y-1')}
                aria-label="DID Scopename"
            >
                <tbody className="w-full" aria-label="DID Scopename">
                    <tr aria-label="Scope">
                        <Titletd>Scope</Titletd>
                        <Contenttd>{meta.scope}</Contenttd>
                    </tr>
                    <tr aria-label="Name">
                        <Titletd>Name</Titletd>
                        <Contenttd>{meta.name}</Contenttd>
                    </tr>
                </tbody>
            </table>
            <table
                className={twMerge(
                    'bg-neutral-0 dark:bg-neutral-700',
                    'w-full rounded border-separate border-spacing-y-1',
                    meta.did_type === 'File' ? 'table' : 'hidden',
                )}
                aria-label="File Information"
                aria-hidden={meta.did_type !== 'File'}
            >
                <tbody className="w-full" aria-label="File Information">
                    <tr aria-label="Size">
                        <Titletd>Size</Titletd>
                        <Contenttd>
                            <FileSize bytesNumber={meta.bytes as number} />
                        </Contenttd>
                    </tr>
                    <tr aria-label="GUID">
                        <Titletd>GUID</Titletd>
                        <Contenttd>{meta.guid as string}</Contenttd>
                    </tr>
                    <tr aria-label="Adler32 Checksum">
                        <Titletd>Adler32</Titletd>
                        <Contenttd>{meta.adler32 as string}</Contenttd>
                    </tr>
                    <tr aria-label="MD5 Checksum">
                        <Titletd>MD5</Titletd>
                        <Contenttd>{meta.md5 as string}</Contenttd>
                    </tr>
                </tbody>
            </table>
            <table
                className={twMerge('bg-neutral-0 dark:bg-neutral-700', 'w-full rounded border-separate border-spacing-y-1')}
                aria-label="Date Information"
            >
                <tbody className="w-full" aria-label="Date Information">
                    <tr aria-label="Date of DID Creation">
                        <Titletd>Created At</Titletd>
                        <Contenttd>{format('yyyy-MM-dd', new Date(meta.created_at))}</Contenttd>
                    </tr>
                    <tr aria-label="Last Updated at">
                        <Titletd>Updated At</Titletd>
                        <Contenttd>{format('yyyy-MM-dd', new Date(meta.updated_at))}</Contenttd>
                    </tr>
                </tbody>
            </table>
            <table
                className={twMerge('bg-neutral-0 dark:bg-neutral-700', 'w-full rounded border-separate border-spacing-y-1')}
                aria-label="DID Information"
            >
                <tbody className="w-full" aria-label="DID Information">
                    <tr aria-label="DID Type">
                        <Titletd>DID Type</Titletd>
                        <td>
                            <DIDTypeTag didtype={meta.did_type} neversmall />
                        </td>
                    </tr>
                    <tr aria-label="Associated Account">
                        <Titletd>Account</Titletd>
                        <Contenttd>{meta.account}</Contenttd>
                    </tr>
                    <tr className={twMerge(meta.did_type === 'File' ? 'collapse' : 'visible')} aria-label="Is DID Open">
                        <Titletd>Is Open</Titletd>
                        <td>
                            <BoolTag val={!!meta.is_open} />
                        </td>
                    </tr>
                    <tr aria-label="Monotonic">
                        <Titletd>Monotonic</Titletd>
                        <td>
                            <BoolTag val={meta.monotonic} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <table
                className={twMerge('bg-neutral-0 dark:bg-neutral-700', 'w-full rounded border-separate border-spacing-y-1')}
                aria-label="Further DID Information"
            >
                <tbody className="w-full" aria-label="Further DID Information">
                    <tr aria-label="DID Obsolete">
                        <Titletd className="w-40">Obsolete</Titletd>
                        <td>
                            <BoolTag val={meta.obsolete} />
                        </td>
                    </tr>
                    <tr aria-label="DID Hidden">
                        <Titletd>Hidden</Titletd>
                        <td>
                            <BoolTag val={meta.hidden} />
                        </td>
                    </tr>
                    <tr className="" aria-label="DID Suppressed">
                        <Titletd>Suppressed</Titletd>
                        <td>
                            <BoolTag val={meta.suppressed} />
                        </td>
                    </tr>
                    <tr className="" aria-label="Purge DID Replicas">
                        <Titletd>Purge Replicas</Titletd>
                        <td>
                            <BoolTag val={meta.purge_replicas} />
                        </td>
                    </tr>
                    <tr className="" aria-label="DID Availability">
                        <Titletd>Availability</Titletd>
                        <td>
                            <AvailabilityTag availability={meta.availability} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
