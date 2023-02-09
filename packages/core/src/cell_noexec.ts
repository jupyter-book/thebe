/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ICell, IOutput } from '@jupyterlab/nbformat';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { getRenderMimeRegistry } from './rendermime';
import type ThebeSession from './session';
import type { IThebeCell, IThebeCellExecuteReturn, JsonObject, MathjaxOptions } from './types';
import { ensureString, shortId } from './utils';

export default class NonExecutableCell implements IThebeCell {
  id: string;
  notebookId: string;
  source: string;
  busy: boolean;
  metadata: JsonObject;

  constructor(id: string, notebookId: string, source: string) {
    this.id = id;
    this.notebookId = notebookId;
    this.source = source;
    this.busy = false;
    this.metadata = {};
  }

  static fromICell(
    ic: ICell,
    notebookId: string,
    rendermime?: IRenderMimeRegistry,
    mathjaxOptions?: MathjaxOptions,
  ) {
    const cell = new NonExecutableCell(
      typeof ic.id === 'string' ? ic.id : shortId(),
      notebookId,
      ensureString(ic.source),
    );
    Object.assign(cell.metadata, ic.metadata);
    return cell;
  }

  get rendermime() {
    return getRenderMimeRegistry();
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

  setAsBusy(): void {
    // no-op
  }

  setAsIdle(): void {
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
