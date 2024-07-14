/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ICell, IOutput } from '@jupyterlab/nbformat';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import PassiveCellRenderer from './passive';
import type ThebeSession from './session';
import type { CellKind, IThebeCell, IThebeCellExecuteReturn, JsonObject } from './types';
import { ensureString, shortId } from './utils';
import type ThebeNotebook from './notebook';

/**
 * A Thebe cell that is exepected to contain markdown (or raw) source.
 *
 * Currently this just separates content cells from code cells and thebe provides no
 * special handling for markdown cells.
 *
 */
export default class ThebeMarkdownCell extends PassiveCellRenderer implements IThebeCell {
  id: string;
  notebookId: string;
  kind: CellKind;
  source: string;
  busy: boolean;
  metadata: JsonObject;

  constructor(
    id: string,
    notebookId: string,
    source: string,
    metadata: JsonObject,
    rendermime: IRenderMimeRegistry,
  ) {
    super(id, [], rendermime);
    this.kind = 'markdown';
    this.id = id;
    this.notebookId = notebookId;
    this.source = source;
    this.busy = false;
    this.metadata = metadata;
  }

  static fromICell(ic: ICell, notebookId: string, rendermime: IRenderMimeRegistry) {
    const cell = new ThebeMarkdownCell(
      typeof ic.id === 'string' ? ic.id : shortId(),
      notebookId,
      ensureString(ic.source),
      ic.metadata,
      rendermime,
    );
    return cell;
  }

  get isAttachedToDOM() {
    return false;
  }

  get isBusy() {
    return false;
  }

  get isAttached() {
    return false;
  }

  get executionCount(): number | null {
    return null;
  }

  setAsBusy(): void {
    // no-op
  }

  setAsIdle(): void {
    // no-op
  }

  initOutputs(initialOutputs: IOutput[]) {
    // no-op
  }

  reset() {
    // no-op
  }

  attachToDOM(el?: HTMLElement) {
    // could potentially allow for markdown rendering here
  }

  attachSession(session: ThebeSession) {
    // no-op
  }

  detachSession(): void {
    // no-op
  }

  setOutputText(text: string) {
    // no-op
  }

  clear() {
    // no-op
  }

  clearOnError(error?: any) {
    // no-op
  }

  messageBusy(): void {
    // no-op
  }

  messageCompleted(): void {
    // no-op
  }

  messageError(message: string): void {
    // no-op
  }

  render(outputs: IOutput[]): void {
    // no-op
  }

  get tags(): string[] {
    return [];
  }

  get outputs() {
    return [] as IOutput[];
  }

  async execute(source?: string): Promise<IThebeCellExecuteReturn | null> {
    // could potentially allow for markdown rendering here
    return { id: this.id, height: 0, width: 0 };
  }
}
