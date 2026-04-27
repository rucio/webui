/**
 * Thin wrapper around window.location.assign so that tests can mock it
 * without fighting jsdom's non-writable Location object.
 */
export function navigateTo(url: string): void {
    window.location.assign(url);
}
