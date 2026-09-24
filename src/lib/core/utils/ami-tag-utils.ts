/**
 * Helpers for ATLAS AMI tags. Tags are read from the Version field of an ATLAS
 * DID name (see atlas-did-name.ts), e.g. r15869_p6304 in
 * data22_13p6TeV.00437756.physics_Main.merge.AOD.r15869_p6304_tid40703687_00
 */
import { getAtlasAmiTags } from '@/lib/core/utils/atlas-did-name';

export const DEFAULT_AMI_BASE_URL = 'https://atlas-ami.cern.ch';
export const MAX_AMI_TAGS_PER_REQUEST = 10;

/** One tag: a single lowercase letter followed by digits (AMI's own rule). */
export const AMI_TAG_REGEX = /^[a-z]\d+$/;

export function isAmiTag(tag: string): boolean {
    return AMI_TAG_REGEX.test(tag);
}

/** AMI tags of an ATLAS DID name, in order; empty for names without a Version field. */
export function parseAmiTags(name: string): string[] {
    return getAtlasAmiTags(name);
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
