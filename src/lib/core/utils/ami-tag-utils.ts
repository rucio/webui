/**
 * Helpers for ATLAS AMI tags embedded in DID names, e.g. the "f1723_m2281"
 * segment of data26_hi.00523138.physics_HardProbes.merge.AOD.f1723_m2281._lb0490._0003.1
 */

export const DEFAULT_AMI_BASE_URL = 'https://atlas-ami.cern.ch';
export const MAX_AMI_TAGS_PER_REQUEST = 10;

/** One tag: a single lowercase letter followed by at least 3 digits. */
export const AMI_TAG_REGEX = /^[a-z]\d{3,}$/;
/** A whole dot-separated name segment made only of tags joined by "_". */
export const AMI_TAG_SEGMENT_REGEX = /^[a-z]\d{3,}(?:_[a-z]\d{3,})*$/;

export function isAmiTag(tag: string): boolean {
    return AMI_TAG_REGEX.test(tag);
}

/** Returns the AMI tags found in a DID name, de-duplicated, in first-seen order. */
export function parseAmiTags(name: string): string[] {
    const tags: string[] = [];
    for (const segment of name.split('.')) {
        if (!AMI_TAG_SEGMENT_REGEX.test(segment)) continue;
        for (const tag of segment.split('_')) {
            if (!tags.includes(tag)) tags.push(tag);
        }
    }
    return tags;
}

/**
 * Parses the comma-separated `tags` query parameter.
 * Returns null when it is missing, empty, over the limit, or contains a non-tag.
 */
export function parseAmiTagsParam(raw: string | string[] | undefined): string[] | null {
    if (raw === undefined) return null;
    const joined = Array.isArray(raw) ? raw.join(',') : raw;
    const tags: string[] = [];
    for (const part of joined.split(',')) {
        const tag = part.trim();
        if (tag !== '' && !tags.includes(tag)) tags.push(tag);
    }
    if (tags.length === 0 || tags.length > MAX_AMI_TAGS_PER_REQUEST) return null;
    return tags.every(isAmiTag) ? tags : null;
}

export function normalizeAmiBaseUrl(baseUrl?: string): string {
    const trimmed = baseUrl?.trim();
    return (trimmed ? trimmed : DEFAULT_AMI_BASE_URL).replace(/\/+$/, '');
}

export function createAmiTagUrl(baseUrl: string, tag: string): string {
    return `${normalizeAmiBaseUrl(baseUrl)}/?subapp=tagsShow&userdata=${encodeURIComponent(tag)}`;
}

export function createAmiApiUrl(baseUrl: string): string {
    return `${normalizeAmiBaseUrl(baseUrl)}/AMI2/FrontEnd`;
}
