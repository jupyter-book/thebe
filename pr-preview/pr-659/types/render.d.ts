import type { ThebeNotebook } from 'thebe-core';
import type { Options } from './options';
import type { CellDOMPlaceholder } from './types';
/**
 * findCells will find cells and outputs, associating outputs with cells
 * in fifo priority
 *
 * Note: this mirrors the original thebe behaviour
 *
 * @param selector
 * @param outputSelector
 * @returns
 */
export declare function findCells(selector: string, outputSelector: string): CellDOMPlaceholder[];
export declare function setButtonsBusy(id: string): void;
export declare function clearButtonsBusy(id: string): void;
export declare function renderAllCells(options: Options, notebook: ThebeNotebook, placeholders: CellDOMPlaceholder[]): CellDOMPlaceholder[];
