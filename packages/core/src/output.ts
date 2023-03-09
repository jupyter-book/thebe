import type { IBackboneModelOptions } from '@jupyter-widgets/base';
import type { LabWidgetManager } from '@jupyter-widgets/jupyterlab-manager';
import { WidgetManager } from '@jupyter-widgets/jupyterlab-manager';
import * as outputBase from '@jupyter-widgets/output';
import type * as nbformat from '@jupyterlab/nbformat';
import { OutputAreaModel } from '@jupyterlab/outputarea';
import type { KernelMessage, Session } from '@jupyterlab/services';

/**
 * using the same (temporary) appraoch as Voila to  enable use of an output model with the
 * KernelWidgetManager
 *
 * see: https://github.dev/voila-dashboards/voila/blob/main/packages/voila/src/manager.ts
 */
export class OutputModel extends outputBase.OutputModel {
  defaults(): Backbone.ObjectHash {
    return { ...super.defaults(), msg_id: '', outputs: [] };
  }

  initialize(attributes: Backbone.ObjectHash, options: IBackboneModelOptions): void {
    super.initialize(attributes, options);
    // The output area model is trusted since widgets are only rendered in trusted contexts.
    this._outputs = new OutputAreaModel({ trusted: true });

    // TODO a different waay to get the kernel changed message?
    // if the context is available, react on kernel changes
    // if (this.widget_manager instanceof WidgetManager) {
    //   this.widget_manager.context.sessionContext.kernelChanged.connect((sender, args) => {
    //     this._handleKernelChanged(args);
    //   });
    // }

    this.listenTo(this, 'change:msg_id', this.reset_msg_id);
    this.listenTo(this, 'change:outputs', this.setOutputs);
    this.setOutputs();
  }

  /**
   * Register a new kernel
   */
  _handleKernelChanged({ oldValue }: Session.ISessionConnection.IKernelChangedArgs): void {
    const msgId = this.get('msg_id');
    if (msgId && oldValue) {
      oldValue.removeMessageHook(msgId, this._msgHook);
      this.set('msg_id', null);
    }
  }

  /**
   * Reset the message id.
   */
  reset_msg_id(): void {
    const kernel = this.widget_manager.kernel;
    const msgId = this.get('msg_id');
    const oldMsgId = this.previous('msg_id');

    // Clear any old handler.
    if (oldMsgId && kernel) {
      kernel.removeMessageHook(oldMsgId, this._msgHook);
    }

    // Register any new handler.
    if (msgId && kernel) {
      kernel.registerMessageHook(msgId, this._msgHook);
    }
  }

  add(msg: KernelMessage.IIOPubMessage): void {
    const msgType = msg.header.msg_type;
    switch (msgType) {
      case 'execute_result':
      case 'display_data':
      case 'stream':
      case 'error': {
        const model = msg.content as nbformat.IOutput;
        model.output_type = msgType as nbformat.OutputType;
        this._outputs.add(model);
        break;
      }
      case 'clear_output':
        this.clear_output((msg as KernelMessage.IClearOutputMsg).content.wait);
        break;
      default:
        break;
    }
    this.set('outputs', this._outputs.toJSON(), { newMessage: true });
    this.save_changes();
  }

  clear_output(wait = false): void {
    this._outputs.clear(wait);
  }

  get outputs(): OutputAreaModel {
    return this._outputs;
  }

  setOutputs(model?: any, value?: any, options?: any): void {
    if (!(options && options.newMessage)) {
      // fromJSON does not clear the existing output
      this.clear_output();
      // fromJSON does not copy the message, so we make a deep copy
      this._outputs.fromJSON(JSON.parse(JSON.stringify(this.get('outputs'))));
    }
  }

  widget_manager!: LabWidgetManager;

  private _msgHook = (msg: KernelMessage.IIOPubMessage): boolean => {
    this.add(msg);
    return false;
  };

  private _outputs!: OutputAreaModel;
}
