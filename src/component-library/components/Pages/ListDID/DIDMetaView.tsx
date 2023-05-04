import { DIDMeta } from "@/lib/core/data/rucio-dto"
import { DIDTypeTag } from "../../Tags/DIDTypeTag"
import { BoolTag } from "../../Tags/BoolTag"
import { twMerge } from "tailwind-merge"
import { AvailabilityTag } from "../../Tags/AvailabilityTag"
var format = require("date-format")

export const DIDMetaView = (
    props: {
        data: DIDMeta
        show: boolean
    }
) => {
    const meta = props.data
    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2",
                props.show ? "block" : "hidden",
            )}
        >
            <table className="w-full bg-white rounded border-separate border-spacing-y-1">
                <tbody className="w-full">
                    <tr>
                        <td className="font-bold w-32 pl-1">Scope</td>
                        <td className="break-all">{meta.scope}</td>
                    </tr>
                    <tr>
                        <td className="font-bold pl-1">Name</td>
                        <td className="break-all">{meta.name}</td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full bg-white rounded border-separate border-spacing-y-1">
                <tbody className="w-full">
                    <tr>
                        <td className="font-bold w-32 pl-1">Created At</td>
                        <td>{format("yyyy-MM-dd", meta.created_at)}</td>
                    </tr>
                    <tr>
                        <td className="font-bold pl-1">Updated At</td>
                        <td>{format("yyyy-MM-dd", meta.updated_at)}</td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full bg-white rounded border-separate border-spacing-y-1">
                <tbody className="w-full">
                    <tr>
                        <td className="font-bold w-32 pl-1">DID Type</td>
                        <td><DIDTypeTag didtype={meta.did_type} neversmall /></td>
                    </tr>
                    <tr>
                        <td className="font-bold pl-1">Account</td>
                        <td className="break-all">{meta.account}</td>
                    </tr>
                    <tr>
                        <td className="font-bold pl-1">Is Open</td>
                        <td><BoolTag val={meta.is_open} /></td>
                    </tr>
                    <tr>
                        <td className="font-bold pl-1">Monotonic</td>
                        <td><BoolTag val={meta.monotonic} /></td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full bg-white rounded border-separate border-spacing-y-1">
                <tbody className="w-full">
                    <tr>
                        <td className="font-bold w-40 pl-1">Obsolete</td>
                        <td><BoolTag val={meta.obsolete} /></td>
                    </tr>
                    <tr>
                        <td className="font-bold pl-1">Hidden</td>
                        <td><BoolTag val={meta.hidden} /></td>
                    </tr>
                    <tr className="">
                        <td className="font-bold pl-1">Suppressed</td>
                        <td><BoolTag val={meta.suppressed} /></td>
                    </tr>
                    <tr className="">
                        <td className="font-bold pl-1">Purge Replicas</td>
                        <td><BoolTag val={meta.purge_replicas} /></td>
                    </tr>
                    <tr className="">
                        <td className="font-bold pl-1">Availability</td>
                        <td><AvailabilityTag availability={meta.availability}/></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}