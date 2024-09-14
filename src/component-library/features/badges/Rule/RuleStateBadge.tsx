import {RuleState} from "@/lib/core/entity/rucio";
import React from "react";
import {Badge} from "@/component-library/atoms/misc/Badge";
import {cn} from "@/component-library/utils";

const stateString: Record<RuleState, string> = {
    [RuleState.REPLICATING]: "Replicating",
    [RuleState.OK]: "OK",
    [RuleState.STUCK]: "Stuck",
    [RuleState.SUSPENDED]: "Suspended",
    [RuleState.WAITING_APPROVAL]: "Waiting",
    [RuleState.INJECT]: "Inject",
    [RuleState.UNKNOWN]: "Unknown"
};

const stateColorClasses: Record<RuleState, string> = {
    [RuleState.REPLICATING]: "bg-base-warning-400",
    [RuleState.OK]: "bg-base-success-500",
    [RuleState.STUCK]: "bg-base-error-500",
    [RuleState.SUSPENDED]: "bg-neutral-500",
    [RuleState.WAITING_APPROVAL]: "bg-extra-indigo-500",
    [RuleState.INJECT]: "bg-base-info-500",
    [RuleState.UNKNOWN]: "bg-neutral-0 dark:bg-neutral-800"
};

export const RuleStateBadge = (props: { value: RuleState, className?: string }) => {
    const classes = cn(stateColorClasses[props.value], props.className);
    return <Badge value={stateString[props.value]} className={classes}/>
}