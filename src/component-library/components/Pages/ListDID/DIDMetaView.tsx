import { DIDMeta } from "@/lib/core/data/rucio-dto"
import { DIDTypeTag } from "../../Tags/DIDTypeTag"
import { BoolTag } from "../../Tags/BoolTag"
import { twMerge } from "tailwind-merge"
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
            <table className="w-full bg-white">
                <tbody className="w-full">
                    <tr>
                        <td className="font-bold w-32">Name</td>
                        <td>{meta.name}</td>
                    </tr>
                    <tr>
                        <td className="font-bold">Scope</td>
                        <td>{meta.scope}</td>
                    </tr>
                    <tr className="">
                        <td className="font-bold">Account</td>
                        <td>{meta.account}</td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full bg-white">
                <tbody className="w-full">
                    <tr>
                        <td className="font-bold w-32">DID Type</td>
                        <td><DIDTypeTag didtype={meta.did_type} neversmall /></td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full bg-white">
                <tbody className="w-full">
                    <tr>
                        <td className="font-bold w-32">Created At</td>
                        <td>{format("yyyy-MM-dd", meta.created_at)}</td>
                    </tr>
                    <tr>
                        <td className="font-bold">Updated At</td>
                        <td>{format("yyyy-MM-dd", meta.updated_at)}</td>
                    </tr>
                    <tr className="">
                        <td className="font-bold">Availability</td>
                        <td>{meta.availability}</td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full bg-white">
                <tbody className="w-full">
                    <tr>
                        <td className="font-bold w-32">Obsolete</td>
                        <td><BoolTag val={meta.obsolete} /></td>
                    </tr>
                    <tr>
                        <td className="font-bold">Hidden</td>
                        <td><BoolTag val={meta.hidden} /></td>
                    </tr>
                    <tr className="">
                        <td className="font-bold">Suppressed</td>
                        <td><BoolTag val={meta.suppressed} /></td>
                    </tr>
                    <tr className="">
                        <td className="font-bold">Purge Replicas</td>
                        <td><BoolTag val={meta.purge_replicas} /></td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full bg-white rounded border-separate border-spacing-y-1">
                <tbody className="w-full">
                    <tr>
                        <td className="font-bold w-32 pl-1">Is Open</td>
                        <td><BoolTag val={meta.is_open} /></td>
                    </tr>
                    <tr>
                        <td className="font-bold pl-1">Monotonic</td>
                        <td><BoolTag val={meta.monotonic} /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}