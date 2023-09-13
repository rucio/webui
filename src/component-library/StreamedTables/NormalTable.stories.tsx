import { StoryFn, Meta } from "@storybook/react";
import { createColumnHelper } from "@tanstack/react-table";
import { fixtureDIDKeyValuePair } from "test/fixtures/table-fixtures";
import { NormalTable as N } from "./NormalTable";
import { DIDKeyValuePair } from "@/lib/core/entity/rucio";
import { TableFilterString } from "./TableFilterString";
import { DIDAvailability, DIDType } from "@/lib/core/entity/rucio";
import { twMerge } from "tailwind-merge";
import { AvailabilityTag } from "../Tags/AvailabilityTag";
import { BoolTag } from "../Tags/BoolTag";
import { DIDTypeTag } from "../Tags/DIDTypeTag";
import { NullTag } from "../Tags/NullTag";
import { H3 } from "../Text/Headings/H3";

export default {
    title: 'Components/StreamedTables',
    component: N,
} as Meta<typeof N>;

const Template: StoryFn<typeof N> = (args) => <N {...args} />;

const columnHelper = createColumnHelper<DIDKeyValuePair>()

export const NormalTable = Template.bind({});
NormalTable.args = {
    tabledata: Array.from({ length: 100 }, () => fixtureDIDKeyValuePair()),
    tablecolumns: [
        columnHelper.accessor("key", {
            id: "key",
            cell: (info) => {
                return (
                    <span className={twMerge("dark:text-white")}>
                        {info.getValue()}
                    </span>
                )
            },
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="Key"
                    />
                )
            }
        }
        ),
        columnHelper.accessor("value", {
            id: "value",
            cell: (info) => {
                const val = info.getValue()
                if (typeof (val) === "boolean") {
                    return <BoolTag val={val} />
                }
                if (val === null) {
                    return <NullTag />
                }
                if (["Available", "Deleted", "Lost"].includes(val as string)) {
                    return <AvailabilityTag availability={val as DIDAvailability} />
                }
                if (Object.values(DIDType).includes(val as DIDType)) {
                    return <DIDTypeTag didtype={val as DIDType} />
                }
                else {
                    return <span className="dark:text-white">{val as string}</span>
                }
            },
            header: info => {
                return (
                    <H3 className="text-left">Value</H3>
                )
            }
        })

    ]
};
