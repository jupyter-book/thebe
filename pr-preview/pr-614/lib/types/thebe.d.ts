import type { Options } from './options';
import { ThebeServer } from 'thebe-core';
export * from './render';
export { Options, mergeOptions, getPageConfig, getPageConfigValue, ensurePageConfigLoaded, } from './options';
export * from './utils';
export declare function mountStatusWidget(): void;
export declare function mountActivateWidget(options?: Options): void;
/**
 * Bootstrap the library based on the configuration given.
 *
 * If bootstrap === true in the configuration and the library is loaded statically
 * then this function will be called automatically on the document load event.
 *
 * @param {Object} options Object containing thebe options.
 * Same structure as x-thebe-options.
 * @returns {Promise} Promise for connected Kernel object
 */
export declare function bootstrap(opts?: Partial<Options>): Promise<{
    server: ThebeServer;
    notebook: import("thebe-core/dist/types/notebook").default;
    session?: undefined;
} | {
    server: ThebeServer;
    session: import("thebe-core/dist/types/session").default | null;
    notebook: import("thebe-core/dist/types/notebook").default;
}>;
