// date-format ships no type definitions. Only the default export is used.
declare module 'date-format' {
    function asString(format: string, date: Date): string;
    export default asString;
}
