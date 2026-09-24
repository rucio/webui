/** Helpers for PanDA (JEDI) task links shown for ATLAS DIDs. */

export const DEFAULT_PANDA_BASE_URL = 'https://bigpanda.cern.ch';

/** A JEDI task ID: 1 to 12 digits. */
export const PANDA_TASK_ID_REGEX = /^\d{1,12}$/;

export function isPandaTaskId(taskId: string): boolean {
    return PANDA_TASK_ID_REGEX.test(taskId);
}

export function normalizePandaBaseUrl(baseUrl?: string): string {
    const trimmed = baseUrl?.trim();
    return (trimmed ? trimmed : DEFAULT_PANDA_BASE_URL).replace(/\/+$/, '');
}

export function createPandaTaskUrl(baseUrl: string, taskId: string): string {
    return `${normalizePandaBaseUrl(baseUrl)}/task/?jeditaskid=${encodeURIComponent(taskId)}`;
}
