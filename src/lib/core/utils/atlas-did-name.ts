/**
 * ATLAS DID naming conventions (confirmed with ATLAS, 2026-09-24):
 *   data*          project.runNumber.streamName.prodStep.dataType.Version
 *   mc*, valid*    project.datasetNumber.physicsShort.prodStep.dataType.Version
 *   cond*          project.internalCondNumber.shortComment.COND
 *   user, group    user.userName.<ignored>, group.groupName.<ignored>
 *   files          dataType.pandaTaskId._jobNumber.<ignored>
 * The Version field holds AMI tags and an optional PanDA task suffix:
 *   r15869_p6304_tid40703687_00 -> AMI tags r15869, p6304; PanDA task 40703687
 */

export interface AtlasVersion {
    /** Version without the PanDA suffix, e.g. r15869_p6304 */
    value: string;
    amiTags: string[];
    pandaTaskId?: string;
}

interface AtlasProductionFields {
    project: string;
    prodStep: string;
    dataType: string;
    version?: AtlasVersion;
}

export interface AtlasDataName extends AtlasProductionFields {
    scheme: 'data';
    runNumber: string;
    streamName: string;
}

export interface AtlasSimulationName extends AtlasProductionFields {
    scheme: 'mc' | 'valid';
    datasetNumber: string;
    physicsShort: string;
}

export interface AtlasCondName {
    scheme: 'cond';
    project: string;
    internalCondNumber: string;
    shortComment: string;
}

export interface AtlasUserName {
    scheme: 'user';
    userName: string;
}

export interface AtlasGroupName {
    scheme: 'group';
    groupName: string;
}

export interface AtlasFileName {
    scheme: 'file';
    dataType: string;
    pandaTaskId: string;
    jobNumber: string;
}

export type AtlasDIDName = AtlasDataName | AtlasSimulationName | AtlasCondName | AtlasUserName | AtlasGroupName | AtlasFileName;

const AMI_TAG_TOKEN = /^[a-z]\d+$/;
const PANDA_TASK_TOKEN = /^tid(\d+)$/;
const PRODUCTION_PROJECT = /^(?:data|mc|valid)\d/;
const COND_PROJECT = /^cond\d/;
// Uppercase data types (DAOD_PHYS, HITS, RDO...) plus lowercase log tarballs
const FILE_DATA_TYPE = /^(?:[A-Z][A-Z0-9_]*|log)$/;
const DIGITS = /^\d+$/;
const JOB_NUMBER = /^_(\d+)$/;

/** Splits a Version field into AMI tags and PanDA task; undefined for suffix fields like "_lb0490". */
export function parseAtlasVersion(field: string): AtlasVersion | undefined {
    if (field === '' || field.startsWith('_')) return undefined;
    const tokens = field.split('_');
    const taskIndex = tokens.findIndex(token => PANDA_TASK_TOKEN.test(token));
    const valueTokens = taskIndex === -1 ? tokens : tokens.slice(0, taskIndex);
    const version: AtlasVersion = {
        value: valueTokens.join('_'),
        amiTags: [...new Set(valueTokens.filter(token => AMI_TAG_TOKEN.test(token)))],
    };
    if (taskIndex !== -1) {
        version.pandaTaskId = (PANDA_TASK_TOKEN.exec(tokens[taskIndex]) as RegExpExecArray)[1];
    }
    return version;
}

function parseProductionName(fields: string[]): AtlasDataName | AtlasSimulationName | null {
    if (fields.length < 5) return null;
    const [project, number, description, prodStep, dataType, versionField] = fields;
    // runNumber / datasetNumber are numeric; this rejects e.g. period containers
    // (data18_13TeV.periodAllYear...PhysCont...grp18_v01_p6479), whose last field is not a Version
    if (!DIGITS.test(number)) return null;
    const version = versionField === undefined ? undefined : parseAtlasVersion(versionField);
    const common: AtlasProductionFields = { project, prodStep, dataType, ...(version ? { version } : {}) };
    if (project.startsWith('data')) {
        return { scheme: 'data', runNumber: number, streamName: description, ...common };
    }
    return { scheme: project.startsWith('mc') ? 'mc' : 'valid', datasetNumber: number, physicsShort: description, ...common };
}

/** Parses a DID name according to the ATLAS naming conventions; null when it follows none of them. */
export function parseAtlasDIDName(name: string): AtlasDIDName | null {
    // Legacy ATLAS containers end with a single "/"
    const fields = name.replace(/\/$/, '').split('.');
    const [first, second = ''] = fields;

    if (first === 'user' || first === 'group') {
        if (second === '') return null;
        return first === 'user' ? { scheme: 'user', userName: second } : { scheme: 'group', groupName: second };
    }
    if (PRODUCTION_PROJECT.test(first)) {
        return parseProductionName(fields);
    }
    if (COND_PROJECT.test(first)) {
        if (fields.length < 4 || fields[3] !== 'COND') return null;
        return { scheme: 'cond', project: first, internalCondNumber: second, shortComment: fields[2] };
    }
    const jobMatch = JOB_NUMBER.exec(fields[2] ?? '');
    if (FILE_DATA_TYPE.test(first) && DIGITS.test(second) && jobMatch) {
        return { scheme: 'file', dataType: first, pandaTaskId: second, jobNumber: jobMatch[1] };
    }
    return null;
}

/** AMI tags from the Version field; empty for names without one. */
export function getAtlasAmiTags(name: string): string[] {
    const parsed = parseAtlasDIDName(name);
    if (!parsed || !('version' in parsed) || !parsed.version) return [];
    return parsed.version.amiTags;
}

/** PanDA task ID from the Version field or, for file names, the task field. */
export function getAtlasPandaTaskId(name: string): string | undefined {
    const parsed = parseAtlasDIDName(name);
    if (!parsed) return undefined;
    if (parsed.scheme === 'file') return parsed.pandaTaskId;
    return 'version' in parsed ? parsed.version?.pandaTaskId : undefined;
}
