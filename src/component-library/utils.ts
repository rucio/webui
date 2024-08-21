// Function to emulate pausing between interactions
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
