import type { CodeMirrorEditor } from '@jupyterlab/codemirror';
import type { ThebeEventCb, ThebeEvents, ThebeNotebook, ThebeServer, ThebeSession, ThebeCoreGlobal } from 'thebe-core';
import type { ActivateWidget } from './activate';
import type { Options } from './options';
import type { KernelStatus } from './status';
import type { ThebeLiteGlobal } from 'thebe-lite';
export interface CellDOMPlaceholder {
    id: string;
    placeholders: {
        source: Element;
        output?: Element;
    };
}
export type CellDOMItem = CellDOMPlaceholder & {
    ui: {
        cell: Element;
        editor: Element;
        output?: Element;
        buttons: {
            run?: Element;
            runAll?: Element;
            restart?: Element;
            restartAll?: Element;
        };
    };
};
export interface ThebeGlobal {
    mountStatusWidget: () => void;
    mountActivateWidget: () => void;
    bootstrap: (options: Partial<Options>) => Promise<any>;
    notebook?: ThebeNotebook;
    server?: ThebeServer;
    session?: ThebeSession;
    kernelStatus?: KernelStatus;
    activateButton?: ActivateWidget;
    events: ThebeEvents;
    trigger: ThebeEventCb;
    on: (event: string, cb: ThebeEventCb) => void;
    one: (event: string, cb: ThebeEventCb) => void;
    off: (event: string, cb: ThebeEventCb) => void;
}
declare global {
    interface Window {
        define: any;
        requirejs: any;
        thebeLite?: ThebeLiteGlobal;
        thebeCore?: ThebeCoreGlobal;
        thebe: ThebeGlobal;
        thebelab: ThebeGlobal;
        CodeMirror: CodeMirrorEditor;
    }
}
