import { DIDMeta } from "@/lib/core/data/rucio-dto"
import { DIDTypeTag } from "../../Tags/DIDTypeTag"
import { BoolTag } from "../../Tags/BoolTag"
import { twMerge } from "tailwind-merge"
import { AvailabilityTag } from "../../Tags/AvailabilityTag"
import { Number } from "../../Text/Content/Number"
var format = require("date-format")

export const DIDMetaView = (
    props: {
        data: DIDMeta
        show: boolean
        horizontal?: boolean
    }
) => {
    const Titletd: React.FC<JSX.IntrinsicElements["td"]> = ({ ...props }) => {
        const {className, ...otherprops} = props
        return (
            <td
                className={twMerge(
                    "font-bold w-32 pl-1 dark:text-white",
                    className ?? ""
                )}
                {...otherprops}
            >
                {props.children}
            </td>
        )
    }
    const Contenttd: React.FC<JSX.IntrinsicElements["td"]> = ({ ...props }) => {
        const {className, ...otherprops} = props
        return (
            <td
                className={twMerge(
                    "break-all dark:text-gray-100",
                    className ?? ""
                )}
                {...otherprops}
            >
                {props.children}
            </td>
        )
    }
    const meta = props.data
    return (
        <div
            className={twMerge(
                !props.horizontal ?? false ? "flex flex-col space-y-2" : "grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2 gap-y-2",
                props.show ? "" : "hidden",
            )}
        >
            <table
                className={twMerge(
                    "bg-white dark:bg-gray-700",
                    "w-full rounded border-separate border-spacing-y-1"
                )}
            >
                <tbody className="w-full">
                    <tr>
                        <Titletd>Scope</Titletd>
                        <Contenttd>{meta.scope}</Contenttd>
                    </tr>
                    <tr>
                        <Titletd>Name</Titletd>
                        <Contenttd>{meta.name}</Contenttd>
                    </tr>
                </tbody>
            </table>
            <table className={twMerge(
                "bg-white dark:bg-gray-700",
                "w-full rounded border-separate border-spacing-y-1",
                meta.did_type === "File" ? "table" : "hidden"
            )}>
                <tbody className="w-full">
                    <tr>
                        <Titletd>Size</Titletd>
                        <Contenttd><Number number={meta.filesize as number} /></Contenttd>
                    </tr>
                    <tr>
                        <Titletd>GUID</Titletd>
                        <Contenttd>{meta.guid as string}</Contenttd>
                    </tr>
                    <tr>
                        <Titletd>Adler32</Titletd>
                        <Contenttd>{meta.adler32 as string}</Contenttd>
                    </tr>
                    <tr>
                        <Titletd>MD5</Titletd>
                        <Contenttd>{meta.md5 as string}</Contenttd>
                    </tr>
                </tbody>
            </table>
            <table
                className={twMerge(
                    "bg-white dark:bg-gray-700",
                    "w-full rounded border-separate border-spacing-y-1"
                )}
            >
                <tbody className="w-full">
                    <tr>
                        <Titletd>Created At</Titletd>
                        <Contenttd>{format("yyyy-MM-dd", meta.created_at)}</Contenttd>
                    </tr>
                    <tr>
                        <Titletd>Updated At</Titletd>
                        <Contenttd>{format("yyyy-MM-dd", meta.updated_at)}</Contenttd>
                    </tr>
                </tbody>
            </table>
            <table
                className={twMerge(
                    "bg-white dark:bg-gray-700",
                    "w-full rounded border-separate border-spacing-y-1"
                )}
            >
                <tbody className="w-full">
                    <tr>
                        <Titletd>DID Type</Titletd>
                        <td><DIDTypeTag didtype={meta.did_type} neversmall /></td>
                    </tr>
                    <tr>
                        <Titletd>Account</Titletd>
                        <Contenttd>{meta.account}</Contenttd>
                    </tr>
                    <tr className={twMerge(
                        meta.did_type === "File" ? "collapse" : "visible"
                    )}>
                        <Titletd>Is Open</Titletd>
                        <td><BoolTag val={!!meta.is_open} /></td>
                    </tr>
                    <tr>
                        <Titletd>Monotonic</Titletd>
                        <td><BoolTag val={meta.monotonic} /></td>
                    </tr>
                </tbody>
            </table>
            <table
                className={twMerge(
                    "bg-white dark:bg-gray-700",
                    "w-full rounded border-separate border-spacing-y-1"
                )}
            >
                <tbody className="w-full">
                    <tr>
                        <Titletd className="w-40">Obsolete</Titletd>
                        <td><BoolTag val={meta.obsolete} /></td>
                    </tr>
                    <tr>
                        <Titletd>Hidden</Titletd>
                        <td><BoolTag val={meta.hidden} /></td>
                    </tr>
                    <tr className="">
                        <Titletd>Suppressed</Titletd>
                        <td><BoolTag val={meta.suppressed} /></td>
                    </tr>
                    <tr className="">
                        <Titletd>Purge Replicas</Titletd>
                        <td><BoolTag val={meta.purge_replicas} /></td>
                    </tr>
                    <tr className="">
                        <Titletd>Availability</Titletd>
                        <td><AvailabilityTag availability={meta.availability} /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}