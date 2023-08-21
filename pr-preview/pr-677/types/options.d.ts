import type { CoreOptions } from 'thebe-core';
export interface ThebeOptions {
    bootstrap?: boolean;
    useBinder?: boolean;
    useJupyterLite?: boolean;
    requestKernel?: boolean;
    selector?: string;
    outputSelector?: string;
    predefinedOutput?: boolean;
    mountStatusWidget?: boolean;
    mountActivateWidget?: boolean;
    mountRunButton?: boolean;
    mountRunAllButton?: boolean;
    mountRestartButton?: boolean;
    mountRestartallButton?: boolean;
    preRenderHook?: (() => void) | null;
    stripPrompts?: {
        inPrompt?: string;
        continuationPrompt?: string;
    };
    stripOutputPrompts?: {
        outPrompt?: string;
    };
    codeMirrorConfig?: {
        theme?: string;
        readOnly?: boolean;
        mode?: string;
        autoRefresh?: boolean;
        lineNumbers?: boolean;
        styleActiveLine?: boolean;
        matchBrackets?: boolean;
    };
}
export type Options = ThebeOptions & CoreOptions;
export declare const defaultSelector = "[data-executable]";
export declare const defaultOutputSelector = "[data-output]";
export declare const defaultOptions: ThebeOptions;
export declare function mergeOptions(options: Partial<Options>): Options;
export declare function resetPageConfig(): void;
export declare function getPageConfig(): Options;
export declare function getPageConfigValue(key: keyof Options): string | boolean | (() => void) | {
    inPrompt?: string | undefined;
    continuationPrompt?: string | undefined;
} | {
    outPrompt?: string | undefined;
} | {
    theme?: string | undefined;
    readOnly?: boolean | undefined;
    mode?: string | undefined;
    autoRefresh?: boolean | undefined;
    lineNumbers?: boolean | undefined;
    styleActiveLine?: boolean | undefined;
    matchBrackets?: boolean | undefined;
} | import("thebe-core").BinderOptions | import("thebe-core").SavedSessionOptions | import("thebe-core").KernelOptions | import("thebe-core").ServerSettings | null | undefined;
export declare function ensurePageConfigLoaded(): Options;
