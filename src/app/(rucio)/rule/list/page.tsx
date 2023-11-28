'use client';

import { ListRule } from "@/component-library/Pages/Rule/ListRule";
import { RuleViewModel } from "@/lib/infrastructure/data/view-model/rule";
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { HTTPRequest } from "@/lib/sdk/http";
import { useEffect, useState } from "react";

export default function Page() {
    const comDOM = useComDOM<RuleViewModel>(
        'list-rule-query',
        [],
        false,
        Infinity,
        200,
        true
    )
    return (
        <ListRule
            comdom={comDOM}
            webui_host={process.env.NEXT_PUBLIC_WEBUI_HOST ?? "http://localhost:3000"}
        />
    )
}
            