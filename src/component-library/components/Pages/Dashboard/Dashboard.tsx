import { twMerge } from "tailwind-merge";
import { H3 } from "../../Text/Headings/H3";
import { H4 } from "../../Text/Headings/H4";
import { P } from "../../Text/Content/P";
import { Checkbox } from "../../Button/Checkbox";
import { WidgetOngoingrules } from "./Widgets/WidgetOngoingrules";
import { RoleTag } from "../../Tags/RoleTag";
import { Role } from "@/lib/core/entity/account";
import { Ongoingrules, Usedquota } from "@/lib/infrastructure/data/view-model/widgets";
import { WidgetUsedquota } from "./Widgets/WidgetUsedquota";

interface PageDashboardProps {
    accountname: string;
    accountrole: Role;
    inputOngoingrules: Ongoingrules[];
    inputUsedquota: Usedquota[];
}

export const Dashboard = (
    props: PageDashboardProps
) => {
    return (
        <div
            className={twMerge("flex flex-col space-y-2 w-full")}
        >
            <div
                className={twMerge(
                    "flex flex-col",
                    "rounded-md p-2 border",
                    "bg-white dark:bg-gray-800"
                )}
            >
                <div
                    className={twMerge(
                        "flex flex-col space-y-2",
                        "md:flex-row md:justify-between md:space-y-0"
                    )}
                >
                    <div>
                        <H3>Dashboard for {props.accountname}</H3>
                    </div>
                    <div>
                        <RoleTag role={props.accountrole} />
                    </div>
                </div>
            </div>
            <div
                className={twMerge(
                    "flex flex-col space-y-2",
                    "rounded-md p-2 border",
                    "bg-white dark:bg-gray-800"
                )}
            >
                <WidgetOngoingrules input={props.inputOngoingrules} />
                <WidgetUsedquota input={props.inputUsedquota} />
                <form
                    className={twMerge(
                        "bg-stone-100 dark:bg-gray-900 p-2 rounded-md",
                    )}
                    aria-label="Select Widgets"
                    id="select-widgets-panel"
                >
                    <label htmlFor="select-widget-panel">
                        <P className="font-bold">Select Widgets</P>
                    </label>
                    <div
                        className={twMerge(
                            "grid gap-y-0",
                            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        )}
                    >
                        <Checkbox label="Ongoing Rules" />
                        <Checkbox label="Top Quota Overview" />
                    </div>

                </form>

            </div>

        </div>

    );
};
