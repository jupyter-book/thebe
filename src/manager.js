import * as pWidget from '@phosphor/widgets';

import { HTMLManager } from '@jupyter-widgets/html-manager';

import * as outputWidgets from './output';

import { ShimmedComm } from './services-shim';

export class ThebeManager extends HTMLManager {
    get onError() {
        return this._onError
    }

    registerWithKernel(kernel) {
        if (this._commRegistration) {
            this._commRegistration.dispose();
        }
        this._commRegistration = kernel.registerCommTarget(
            this.comm_target_name,
            (comm, message) =>
                this.handle_comm_open(new ShimmedComm(comm), message)
        );
    }

    display_view(msg, view, options) {
        const el = options.el;
        return Promise.resolve(view).then(view => {
            pWidget.Widget.attach(view.pWidget, el);
            view.on('remove', function() {
                console.log('view removed', view);
            });
            return view;
        });
    }

    loadClass(className, moduleName, moduleVersion) {
        if (moduleName === '@jupyter-widgets/output') {
            return Promise.resolve(outputWidgets).then(module => {
                if (module[className]) {
                    return module[className];
                } else {
                    return Promise.reject(
                        `Class ${className} not found in module ${moduleName}`
                    );
                }
            })
        } else {
            return super.loadClass(className, moduleName, moduleVersion)
        }
    }

    callbacks(view) {
        const baseCallbacks = super.callbacks(view)
        return Object.assign({}, baseCallbacks, {
            iopub: { output: (msg) => this._onError.emit(msg) }
        });
    }

    _create_comm(target_name, model_id, data, metadata) {
        const comm = this.kernel.connectToComm(target_name, model_id)
        if (data || metdata) {
            comm.open(data, metadata)
        }
        return Promise.resolve(new ShimmedComm(comm))
    }

    _get_comm_info() {
        return this.kernel.requestCommInfo({ target: this.comm_target_name})
            .then(reply => reply.content.comms)
    }
}
