import {DIDMetaViewModel} from '@/lib/infrastructure/data/view-model/did';
import {cn} from "@/component-library/utils";
import {HiExternalLink} from "react-icons/hi";
import Link from "next/link";
import {ReactNode} from "react";
import {Field} from "@/component-library/atoms/misc/Field";
import {formatDate, formatFileSize} from "@/component-library/features/utils/text-formatters";
import {Divider} from "@/component-library/atoms/misc/Divider";
import Checkbox from "@/component-library/atoms/form/Checkbox";
import {DIDType} from "@/lib/core/entity/rucio";
import {DIDTypeBadge} from "@/component-library/features/badges/DID/DIDTypeBadge";
import {CopyableField} from "@/component-library/features/fields/CopyableField";
import {DIDAvailabilityBadge} from "@/component-library/features/badges/DID/DIDAvailabilityBadge";

const MetaRow = (props: { name: string, children: ReactNode }) => {
    return <div className="flex w-full items-center h-12">
        <span className={cn('text-neutral-700 dark:text-neutral-300',
            'min-w-[10rem] pr-3',
            'font-medium text-right text-sm'
        )}>{props.name}</span>
        <span className="flex items-center">{props.children}</span>
    </div>;
};

const MetaHeader = ({scope, name}: { scope: string, name: string }) => {
    return <Link href={`/did/page/${scope}/${name}`} className={cn(
        "h-[52px] px-4 py-2 space-x-2",
        "bg-neutral-200 dark:bg-neutral-700",
        "border-b border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10",
        "text-neutral-700 dark:text-neutral-300 font-medium",
        "flex grow items-center w-full",
        "hover:text-brand-600 dark:hover:text-brand-400",
        "whitespace-nowrap"
    )}>
        <HiExternalLink className="h-5 w-5"/>
        <span>{scope}:{name}</span>
    </Link>;
};

const MetaContents = ({meta}: { meta: DIDMetaViewModel }) => {
    const getFileInformation = () => {
        return <>
            {meta.bytes && <MetaRow name="Size"><Field>{formatFileSize(meta.bytes)}</Field></MetaRow>}
            {meta.guid && <MetaRow name="GUID"><CopyableField text={meta.guid}/></MetaRow>}
            {meta.adler32 && <MetaRow name="Adler32"><CopyableField text={meta.adler32}/></MetaRow>}
            {meta.md5 && <MetaRow name="MD5"><CopyableField text={meta.md5}/></MetaRow>}
            <Divider/>
        </>;
    };

    return <div className="min-w-full w-fit md:max-h-[0px]">
        <MetaHeader scope={meta.scope} name={meta.name}/>
        <div className="flex flex-col px-4 py-2 w-full">
            <MetaRow name="Type"><DIDTypeBadge value={meta.did_type}/></MetaRow>
            <MetaRow name="Account"><Field>{meta.account}</Field></MetaRow>
            {meta.is_open && <MetaRow name="Is Open"><Checkbox checked={meta.is_open}/></MetaRow>}
            <MetaRow name="Monotonic"><Checkbox checked={meta.monotonic}/></MetaRow>
            <Divider/>
            <MetaRow name="Created At"><Field>{formatDate(meta.created_at)}</Field></MetaRow>
            <MetaRow name="Updated At"><Field>{formatDate(meta.updated_at)}</Field></MetaRow>
            <Divider/>
            {meta.did_type === DIDType.FILE && getFileInformation()}
            <MetaRow name="Obsolete"><Checkbox checked={meta.obsolete}/></MetaRow>
            <MetaRow name="Hidden"><Checkbox checked={meta.hidden}/></MetaRow>
            <MetaRow name="Suppressed"><Checkbox checked={meta.suppressed}/></MetaRow>
            <MetaRow name="Purge Replicas"><Checkbox checked={meta.purge_replicas}/></MetaRow>
            <MetaRow name="Availability"><DIDAvailabilityBadge value={meta.availability}/></MetaRow>
        </div>
    </div>;
}

const MetaStub = () => {
    return <div className="justify-center flex grow">
        <span className="text-sm text-neutral-800 dark:text-neutral-100">Select an identifier</span>
    </div>;
};

export interface ListDIDMetaProps {
    meta?: DIDMetaViewModel
}

export const ListDIDMeta = ({meta}: ListDIDMetaProps) => {
    return <div className={cn(
        meta ? "flex-none" : "flex grow items-center min-h-[10rem]",
        "md:flex-1 overflow-auto",
        "bg-neutral-0 dark:bg-neutral-800",
        "rounded-md border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10",
    )}>
        {meta ? <MetaContents meta={meta}/> : <MetaStub/>}
    </div>;
};
