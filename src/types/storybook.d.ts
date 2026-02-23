/**
 * Stub type declarations for @storybook/react.
 * Used during production builds where storybook is not installed (--omit=dev).
 * When @storybook/react is installed in development, its own types take precedence
 * and this file is ignored by TypeScript.
 */
declare module '@storybook/react' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Meta<T = any> = any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type StoryFn<T = any> = ((args: any) => any) & { args?: any; argTypes?: any; parameters?: any; decorators?: any; storyName?: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type StoryObj<T = any> = any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Args = any;
}
