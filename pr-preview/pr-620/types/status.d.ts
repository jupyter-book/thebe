export declare class KernelStatus {
    stub: string;
    constructor();
    _registerHandlers(): void;
    _messageElement(): Element | null | undefined;
    _fieldElement(): Element | null | undefined;
    /**
     * Mount the status field widget.
     *
     * Contents of the element with class `thebe-status-field` will be replaced with a status widget
     *
     * @returns true if an element with the expected class was found
     */
    mount(): boolean | undefined;
    unmount(): Element | undefined;
}
