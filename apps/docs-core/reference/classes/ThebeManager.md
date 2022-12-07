[thebe-core](../README.md) / [Exports](../modules.md) / ThebeManager

# Class: ThebeManager

## Hierarchy

- `WidgetManager`

  ↳ **`ThebeManager`**

## Table of contents

### Constructors

- [constructor](ThebeManager.md#constructor)

### Properties

- [\_handleCommOpen](ThebeManager.md#_handlecommopen)
- [\_kernelRestoreInProgress](ThebeManager.md#_kernelrestoreinprogress)
- [\_loader](ThebeManager.md#_loader)
- [\_restored](ThebeManager.md#_restored)
- [\_restoredStatus](ThebeManager.md#_restoredstatus)
- [comm\_target\_name](ThebeManager.md#comm_target_name)
- [id](ThebeManager.md#id)

### Accessors

- [context](ThebeManager.md#context)
- [isDisposed](ThebeManager.md#isdisposed)
- [kernel](ThebeManager.md#kernel)
- [onUnhandledIOPubMessage](ThebeManager.md#onunhandlediopubmessage)
- [rendermime](ThebeManager.md#rendermime)
- [restored](ThebeManager.md#restored)
- [restoredStatus](ThebeManager.md#restoredstatus)

### Methods

- [\_create\_comm](ThebeManager.md#_create_comm)
- [\_get\_comm\_info](ThebeManager.md#_get_comm_info)
- [\_handleKernelChanged](ThebeManager.md#_handlekernelchanged)
- [\_handleKernelConnectionStatusChange](ThebeManager.md#_handlekernelconnectionstatuschange)
- [\_handleKernelStatusChange](ThebeManager.md#_handlekernelstatuschange)
- [\_loadFromKernel](ThebeManager.md#_loadfromkernel)
- [\_loadFromKernelModels](ThebeManager.md#_loadfromkernelmodels)
- [\_loadFromNotebook](ThebeManager.md#_loadfromnotebook)
- [\_make\_model](ThebeManager.md#_make_model)
- [\_registerWidgets](ThebeManager.md#_registerwidgets)
- [addWidgetFactories](ThebeManager.md#addwidgetfactories)
- [build\_widgets](ThebeManager.md#build_widgets)
- [callbacks](ThebeManager.md#callbacks)
- [clear\_state](ThebeManager.md#clear_state)
- [create\_view](ThebeManager.md#create_view)
- [disconnect](ThebeManager.md#disconnect)
- [display\_view](ThebeManager.md#display_view)
- [dispose](ThebeManager.md#dispose)
- [filterExistingModelState](ThebeManager.md#filterexistingmodelstate)
- [get\_model](ThebeManager.md#get_model)
- [get\_state](ThebeManager.md#get_state)
- [get\_state\_sync](ThebeManager.md#get_state_sync)
- [handle\_comm\_open](ThebeManager.md#handle_comm_open)
- [has\_model](ThebeManager.md#has_model)
- [inline\_sanitize](ThebeManager.md#inline_sanitize)
- [loadClass](ThebeManager.md#loadclass)
- [loadModelClass](ThebeManager.md#loadmodelclass)
- [loadViewClass](ThebeManager.md#loadviewclass)
- [new\_model](ThebeManager.md#new_model)
- [new\_widget](ThebeManager.md#new_widget)
- [register](ThebeManager.md#register)
- [register\_model](ThebeManager.md#register_model)
- [removeWidgetFactories](ThebeManager.md#removewidgetfactories)
- [resolveUrl](ThebeManager.md#resolveurl)
- [restoreWidgets](ThebeManager.md#restorewidgets)
- [setDirty](ThebeManager.md#setdirty)
- [setViewOptions](ThebeManager.md#setviewoptions)
- [set\_state](ThebeManager.md#set_state)

## Constructors

### constructor

• **new ThebeManager**(`kernel`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `kernel` | `IKernelConnection` |

#### Overrides

JupyterLabManager.constructor

#### Defined in

[packages/core/src/manager.ts:38](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/manager.ts#L38)

## Properties

### \_handleCommOpen

• `Protected` **\_handleCommOpen**: (`comm`: `IComm`, `msg`: `ICommOpenMsg`<``"iopub"`` \| ``"shell"``\>) => `Promise`<`void`\>

#### Type declaration

▸ (`comm`, `msg`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `comm` | `IComm` |
| `msg` | `ICommOpenMsg`<``"iopub"`` \| ``"shell"``\> |

##### Returns

`Promise`<`void`\>

#### Inherited from

JupyterLabManager.\_handleCommOpen

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:102

___

### \_kernelRestoreInProgress

• `Protected` **\_kernelRestoreInProgress**: `boolean`

#### Inherited from

JupyterLabManager.\_kernelRestoreInProgress

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:105

___

### \_loader

• **\_loader**: `RequireJsLoader`

#### Defined in

[packages/core/src/manager.ts:36](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/manager.ts#L36)

___

### \_restored

• `Protected` **\_restored**: `Signal`<[`ThebeManager`](ThebeManager.md), `void`\>

#### Inherited from

JupyterLabManager.\_restored

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:103

___

### \_restoredStatus

• `Protected` **\_restoredStatus**: `boolean`

#### Inherited from

JupyterLabManager.\_restoredStatus

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:104

___

### comm\_target\_name

• `Readonly` **comm\_target\_name**: ``"jupyter.widget"``

The comm target name to register

#### Inherited from

JupyterLabManager.comm\_target\_name

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:171

___

### id

• **id**: `string`

#### Defined in

[packages/core/src/manager.ts:35](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/manager.ts#L35)

## Accessors

### context

• `get` **context**(): `IContext`<`INotebookModel`\>

#### Returns

`IContext`<`INotebookModel`\>

#### Inherited from

JupyterLabManager.context

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:161

___

### isDisposed

• `get` **isDisposed**(): `boolean`

Get whether the manager is disposed.

#### Notes
This is a read-only property.

#### Returns

`boolean`

#### Inherited from

JupyterLabManager.isDisposed

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:51

___

### kernel

• `get` **kernel**(): ``null`` \| `IKernelConnection`

#### Returns

``null`` \| `IKernelConnection`

#### Inherited from

JupyterLabManager.kernel

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:162

___

### onUnhandledIOPubMessage

• `get` **onUnhandledIOPubMessage**(): `ISignal`<`this`, `IIOPubMessage`<`IOPubMessageType`\>\>

A signal emitted for unhandled iopub kernel messages.

#### Returns

`ISignal`<`this`, `IIOPubMessage`<`IOPubMessageType`\>\>

#### Inherited from

JupyterLabManager.onUnhandledIOPubMessage

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:81

___

### rendermime

• `get` **rendermime**(): `IRenderMimeRegistry`

#### Returns

`IRenderMimeRegistry`

#### Inherited from

JupyterLabManager.rendermime

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:65

___

### restored

• `get` **restored**(): `ISignal`<`this`, `void`\>

A signal emitted when state is restored to the widget manager.

#### Notes
This indicates that previously-unavailable widget models might be available now.

#### Returns

`ISignal`<`this`, `void`\>

#### Inherited from

JupyterLabManager.restored

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:72

___

### restoredStatus

• `get` **restoredStatus**(): `boolean`

Whether the state has been restored yet or not.

#### Returns

`boolean`

#### Inherited from

JupyterLabManager.restoredStatus

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:76

## Methods

### \_create\_comm

▸ **_create_comm**(`target_name`, `model_id`, `data?`, `metadata?`, `buffers?`): `Promise`<`IClassicComm`\>

Create a comm.

#### Parameters

| Name | Type |
| :------ | :------ |
| `target_name` | `string` |
| `model_id` | `string` |
| `data?` | `any` |
| `metadata?` | `any` |
| `buffers?` | `ArrayBuffer`[] \| `ArrayBufferView`[] |

#### Returns

`Promise`<`IClassicComm`\>

#### Inherited from

JupyterLabManager.\_create\_comm

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:40

___

### \_get\_comm\_info

▸ **_get_comm_info**(): `Promise`<`any`\>

Get the currently-registered comms.

#### Returns

`Promise`<`any`\>

#### Inherited from

JupyterLabManager.\_get\_comm\_info

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:44

___

### \_handleKernelChanged

▸ `Protected` **_handleKernelChanged**(`«destructured»`): `void`

Register a new kernel

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `IKernelChangedArgs` |

#### Returns

`void`

#### Inherited from

JupyterLabManager.\_handleKernelChanged

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:30

___

### \_handleKernelConnectionStatusChange

▸ **_handleKernelConnectionStatusChange**(`status`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `ConnectionStatus` |

#### Returns

`void`

#### Inherited from

JupyterLabManager.\_handleKernelConnectionStatusChange

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:140

___

### \_handleKernelStatusChange

▸ **_handleKernelStatusChange**(`status`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `Status` |

#### Returns

`void`

#### Inherited from

JupyterLabManager.\_handleKernelStatusChange

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:141

___

### \_loadFromKernel

▸ `Protected` **_loadFromKernel**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

JupyterLabManager.\_loadFromKernel

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:36

___

### \_loadFromKernelModels

▸ `Protected` **_loadFromKernelModels**(): `Promise`<`void`\>

Old implementation of fetching widget models one by one using
the request_state message on each comm.

This is a utility function that can be used in subclasses.

#### Returns

`Promise`<`void`\>

#### Inherited from

JupyterLabManager.\_loadFromKernelModels

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:129

___

### \_loadFromNotebook

▸ **_loadFromNotebook**(`notebook`): `Promise`<`void`\>

Load widget state from notebook metadata

#### Parameters

| Name | Type |
| :------ | :------ |
| `notebook` | `INotebookModel` |

#### Returns

`Promise`<`void`\>

#### Inherited from

JupyterLabManager.\_loadFromNotebook

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:152

___

### \_make\_model

▸ **_make_model**(`options`, `serialized_state?`): `Promise`<`WidgetModel`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `RequiredSome`<`IModelOptions`, ``"model_id"``\> |
| `serialized_state?` | `any` |

#### Returns

`Promise`<`WidgetModel`\>

#### Inherited from

JupyterLabManager.\_make\_model

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:130

___

### \_registerWidgets

▸ `Private` **_registerWidgets**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/manager.ts:155](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/manager.ts#L155)

___

### addWidgetFactories

▸ **addWidgetFactories**(`rendermime`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rendermime` | `IRenderMimeRegistry` |

#### Returns

`void`

#### Defined in

[packages/core/src/manager.ts:50](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/manager.ts#L50)

___

### build\_widgets

▸ **build_widgets**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/manager.ts:65](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/manager.ts#L65)

___

### callbacks

▸ **callbacks**(`view?`): `ICallbacks`

Default callback handler to emit unhandled kernel messages.

#### Parameters

| Name | Type |
| :------ | :------ |
| `view?` | `WidgetView` |

#### Returns

`ICallbacks`

#### Inherited from

JupyterLabManager.callbacks

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:26

___

### clear\_state

▸ **clear_state**(): `Promise`<`void`\>

Close all widgets and empty the widget state.

#### Returns

`Promise`<`void`\>

Promise that resolves when the widget state is cleared.

#### Inherited from

JupyterLabManager.clear\_state

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:171

___

### create\_view

▸ **create_view**<`VT`\>(`model`, `options?`): `Promise`<`VT`\>

Creates a promise for a view of a given model

#### Notes
The implementation must trigger the Lumino 'after-attach' and 'after-show' events when appropriate, which in turn will trigger the view's 'displayed' events.

Make sure the view creation is not out of order with
any state updates.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `VT` | extends `DOMWidgetView`<`VT`\> = `DOMWidgetView` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `DOMWidgetModel` |
| `options?` | `any` |

#### Returns

`Promise`<`VT`\>

#### Inherited from

JupyterLabManager.create\_view

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:64

▸ **create_view**<`VT`\>(`model`, `options?`): `Promise`<`VT`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `VT` | extends `WidgetView`<`VT`\> = `WidgetView` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `WidgetModel` |
| `options?` | `any` |

#### Returns

`Promise`<`VT`\>

#### Inherited from

JupyterLabManager.create\_view

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:65

___

### disconnect

▸ **disconnect**(): `void`

Disconnect the widget manager from the kernel, setting each model's comm
as dead.

#### Returns

`void`

#### Inherited from

JupyterLabManager.disconnect

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:35

___

### display\_view

▸ **display_view**(`msg`, `view`, `options`): `Promise`<`Widget`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `any` |
| `view` | `any` |
| `options` | `any` |

#### Returns

`Promise`<`Widget`\>

#### Defined in

[packages/core/src/manager.ts:100](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/manager.ts#L100)

___

### dispose

▸ **dispose**(): `void`

Dispose the resources held by the manager.

#### Returns

`void`

#### Inherited from

JupyterLabManager.dispose

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:156

___

### filterExistingModelState

▸ `Protected` **filterExistingModelState**(`serialized_state`): `any`

Filter serialized widget state to remove any ID's already present in manager.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized_state` | `any` |

#### Returns

`any`

A copy of the state, with its 'state' attribute filtered

#### Inherited from

JupyterLabManager.filterExistingModelState

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:200

___

### get\_model

▸ **get_model**(`model_id`): `Promise`<`WidgetModel`\>

Get a promise for a model by model id.

#### Notes
If the model is not found, the returned Promise object is rejected.

If you would like to synchronously test if a model exists, use .has_model().

#### Parameters

| Name | Type |
| :------ | :------ |
| `model_id` | `string` |

#### Returns

`Promise`<`WidgetModel`\>

#### Inherited from

JupyterLabManager.get\_model

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:78

___

### get\_state

▸ **get_state**(`options?`): `Promise`<`IManagerState`\>

Asynchronously get the state of the widget manager.

This includes all of the widget models, and follows the format given in
the @jupyter-widgets/schema package.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `IStateOptions` | The options for what state to return. |

#### Returns

`Promise`<`IManagerState`\>

Promise for a state dictionary

#### Inherited from

JupyterLabManager.get\_state

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:145

___

### get\_state\_sync

▸ **get_state_sync**(`options?`): `ReadonlyPartialJSONValue`

Synchronously get the state of the live widgets in the widget manager.

This includes all of the live widget models, and follows the format given in
the @jupyter-widgets/schema package.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `IStateOptions` | The options for what state to return. |

#### Returns

`ReadonlyPartialJSONValue`

A state dictionary

#### Inherited from

JupyterLabManager.get\_state\_sync

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:101

___

### handle\_comm\_open

▸ **handle_comm_open**(`comm`, `msg`): `Promise`<`WidgetModel`\>

Handle when a comm is opened.

#### Parameters

| Name | Type |
| :------ | :------ |
| `comm` | `IClassicComm` |
| `msg` | `ICommOpenMsg`<``"iopub"`` \| ``"shell"``\> |

#### Returns

`Promise`<`WidgetModel`\>

#### Inherited from

JupyterLabManager.handle\_comm\_open

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:89

___

### has\_model

▸ **has_model**(`model_id`): `boolean`

Returns true if the given model is registered, otherwise false.

#### Notes
This is a synchronous way to check if a model is registered.

#### Parameters

| Name | Type |
| :------ | :------ |
| `model_id` | `string` |

#### Returns

`boolean`

#### Inherited from

JupyterLabManager.has\_model

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:85

___

### inline\_sanitize

▸ **inline_sanitize**(`source`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` |

#### Returns

`string`

#### Inherited from

JupyterLabManager.inline\_sanitize

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:167

___

### loadClass

▸ **loadClass**(`className`, `moduleName`, `moduleVersion`): `Promise`<typeof `WidgetModel` \| typeof `WidgetView`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `className` | `string` |
| `moduleName` | `string` |
| `moduleVersion` | `string` |

#### Returns

`Promise`<typeof `WidgetModel` \| typeof `WidgetView`\>

#### Overrides

JupyterLabManager.loadClass

#### Defined in

[packages/core/src/manager.ts:113](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/manager.ts#L113)

___

### loadModelClass

▸ `Protected` **loadModelClass**(`className`, `moduleName`, `moduleVersion`): `Promise`<typeof `WidgetModel`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `className` | `string` |
| `moduleName` | `string` |
| `moduleVersion` | `string` |

#### Returns

`Promise`<typeof `WidgetModel`\>

#### Inherited from

JupyterLabManager.loadModelClass

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:176

___

### loadViewClass

▸ `Protected` **loadViewClass**(`className`, `moduleName`, `moduleVersion`): `Promise`<typeof `WidgetView`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `className` | `string` |
| `moduleName` | `string` |
| `moduleVersion` | `string` |

#### Returns

`Promise`<typeof `WidgetView`\>

#### Inherited from

JupyterLabManager.loadViewClass

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:177

___

### new\_model

▸ **new_model**(`options`, `serialized_state?`): `Promise`<`WidgetModel`\>

Create and return a promise for a new widget model

**`Example`**

```ts
widget_manager.new_model({
     model_name: 'IntSlider',
     model_module: '@jupyter-widgets/controls',
     model_module_version: '1.0.0',
     model_id: 'u-u-i-d'
}).then((model) => { console.log('Create success!', model); },
 (err) => {console.error(err)});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `IModelOptions` | the options for creating the model. |
| `serialized_state?` | `any` | attribute values for the model. |

#### Returns

`Promise`<`WidgetModel`\>

#### Inherited from

JupyterLabManager.new\_model

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:114

___

### new\_widget

▸ **new_widget**(`options`, `serialized_state?`): `Promise`<`WidgetModel`\>

Create a comm and new widget model.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `IWidgetOptions` | same options as new_model but comm is not required and additional options are available. |
| `serialized_state?` | `JSONObject` | serialized model attributes. |

#### Returns

`Promise`<`WidgetModel`\>

#### Inherited from

JupyterLabManager.new\_widget

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:96

___

### register

▸ **register**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `IWidgetRegistryData` |

#### Returns

`void`

#### Inherited from

JupyterLabManager.register

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:82

___

### register\_model

▸ **register_model**(`model_id`, `modelPromise`): `void`

Register a widget model.

#### Parameters

| Name | Type |
| :------ | :------ |
| `model_id` | `string` |
| `modelPromise` | `Promise`<`WidgetModel`\> |

#### Returns

`void`

#### Inherited from

JupyterLabManager.register\_model

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:166

___

### removeWidgetFactories

▸ **removeWidgetFactories**(`rendermime`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rendermime` | `IRenderMimeRegistry` |

#### Returns

`void`

#### Defined in

[packages/core/src/manager.ts:61](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/manager.ts#L61)

___

### resolveUrl

▸ **resolveUrl**(`url`): `Promise`<`string`\>

Resolve a URL relative to the current notebook location.

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`string`\>

#### Inherited from

JupyterLabManager.resolveUrl

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:160

___

### restoreWidgets

▸ **restoreWidgets**(`notebook`, `«destructured»?`): `Promise`<`void`\>

Restore widgets from kernel and saved state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `notebook` | `INotebookModel` |
| `«destructured»` | `Object` |
| › `loadKernel` | `boolean` |
| › `loadNotebook` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Inherited from

JupyterLabManager.restoreWidgets

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:145

___

### setDirty

▸ **setDirty**(): `void`

Set the dirty state of the notebook model if applicable.

TODO: perhaps should also set dirty when any model changes any data

#### Returns

`void`

#### Inherited from

JupyterLabManager.setDirty

#### Defined in

node_modules/@jupyter-widgets/jupyterlab-manager/lib/manager.d.ts:177

___

### setViewOptions

▸ **setViewOptions**(`options?`): `any`

Modifies view options. Generally overloaded in custom widget manager
implementations.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `any` |

#### Returns

`any`

#### Inherited from

JupyterLabManager.setViewOptions

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:53

___

### set\_state

▸ **set_state**(`state`): `Promise`<`WidgetModel`[]\>

Set the widget manager state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `IManagerState` | a Javascript object conforming to the application/vnd.jupyter.widget-state+json spec. Reconstructs all of the widget models in the state, merges that with the current manager state, and then attempts to redisplay the widgets in the state. |

#### Returns

`Promise`<`WidgetModel`[]\>

#### Inherited from

JupyterLabManager.set\_state

#### Defined in

node_modules/@jupyter-widgets/base-manager/lib/manager-base.d.ts:155
