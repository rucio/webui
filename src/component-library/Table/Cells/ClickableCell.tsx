import React from "react";
import Link from "next/link";
import {HiExternalLink} from "react-icons/hi";

export const ClickableCell = (props: { href: string, children: React.ReactNode }) => {
    return (
        <Link href={props.href}>
            <div>
                {props.children}
                <HiExternalLink className="text-neutral-100 text-2xl pl-2 inline"/>
            </div>
        </Link>
    );
}