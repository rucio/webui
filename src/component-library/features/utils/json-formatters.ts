/**
 * Utility functions for JSON formatting and validation.
 * Used by JSONViewer and other components that need to work with JSON data.
 */

/**
 * Formats a JSON string with proper indentation.
 *
 * @param value - The JSON string to format
 * @param indent - Number of spaces for indentation (default: 2)
 * @returns Formatted JSON string, or original value if parsing fails
 *
 * @example
 * ```ts
 * formatJSON('{"name":"John","age":30}')
 * // Returns:
 * // {
 * //   "name": "John",
 * //   "age": 30
 * // }
 * ```
 */
export const formatJSON = (value: string, indent: number = 2): string => {
    try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed, null, indent);
    } catch {
        return value; // Return original if parsing fails
    }
};

/**
 * Checks if a string is valid JSON.
 *
 * @param value - The string to validate
 * @returns true if valid JSON, false otherwise
 *
 * @example
 * ```ts
 * isValidJSON('{"name":"John"}') // true
 * isValidJSON('invalid json')     // false
 * ```
 */
export const isValidJSON = (value: string): boolean => {
    try {
        JSON.parse(value);
        return true;
    } catch {
        return false;
    }
};

/**
 * Minifies a JSON string by removing all whitespace.
 *
 * @param value - The JSON string to minify
 * @returns Minified JSON string, or original value if parsing fails
 *
 * @example
 * ```ts
 * minifyJSON('{\n  "name": "John",\n  "age": 30\n}')
 * // Returns: '{"name":"John","age":30}'
 * ```
 */
export const minifyJSON = (value: string): string => {
    try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed);
    } catch {
        return value; // Return original if parsing fails
    }
};

/**
 * Safely parses a JSON string and returns the parsed object.
 *
 * @param value - The JSON string to parse
 * @param fallback - Fallback value to return if parsing fails (default: null)
 * @returns Parsed JSON object, or fallback value if parsing fails
 *
 * @example
 * ```ts
 * safeJSONParse('{"name":"John"}')           // { name: "John" }
 * safeJSONParse('invalid', {})               // {}
 * safeJSONParse('invalid', null)             // null
 * ```
 */
export const safeJSONParse = <T = unknown>(value: string, fallback: T | null = null): T | null => {
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
};

/**
 * Pretty prints a JSON object or string for debugging.
 *
 * @param value - The value to pretty print (can be object or JSON string)
 * @param indent - Number of spaces for indentation (default: 2)
 * @returns Formatted JSON string
 *
 * @example
 * ```ts
 * prettyPrint({ name: "John", age: 30 })
 * // Returns:
 * // {
 * //   "name": "John",
 * //   "age": 30
 * // }
 * ```
 */
export const prettyPrint = (value: unknown, indent: number = 2): string => {
    try {
        if (typeof value === 'string') {
            const parsed = JSON.parse(value);
            return JSON.stringify(parsed, null, indent);
        }
        return JSON.stringify(value, null, indent);
    } catch {
        return String(value);
    }
};
