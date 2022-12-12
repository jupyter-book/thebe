[thebe-core](README.md) / Exports

# thebe-core

## Table of contents

### Enumerations

- [CellStatusEvent](enums/CellStatusEvent.md)
- [ErrorStatusEvent](enums/ErrorStatusEvent.md)
- [EventSubject](enums/EventSubject.md)
- [KernelStatusEvent](enums/KernelStatusEvent.md)
- [NotebookStatusEvent](enums/NotebookStatusEvent.md)
- [RepoProvider](enums/RepoProvider.md)
- [ServerStatusEvent](enums/ServerStatusEvent.md)
- [SessionStatusEvent](enums/SessionStatusEvent.md)
- [ThebeEventType](enums/ThebeEventType.md)

### Classes

- [Config](classes/Config.md)
- [PassiveCellRenderer](classes/PassiveCellRenderer.md)
- [ThebeCell](classes/ThebeCell.md)
- [ThebeEvents](classes/ThebeEvents.md)
- [ThebeManager](classes/ThebeManager.md)
- [ThebeNotebook](classes/ThebeNotebook.md)
- [ThebeServer](classes/ThebeServer.md)
- [ThebeSession](classes/ThebeSession.md)

### Interfaces

- [BinderOptions](interfaces/BinderOptions.md)
- [CodeBlock](interfaces/CodeBlock.md)
- [CoreOptions](interfaces/CoreOptions.md)
- [IPassiveCell](interfaces/IPassiveCell.md)
- [IThebeCell](interfaces/IThebeCell.md)
- [IThebeCellExecuteReturn](interfaces/IThebeCellExecuteReturn.md)
- [JsApi](interfaces/JsApi.md)
- [KernelOptions](interfaces/KernelOptions.md)
- [RestAPIContentsResponse](interfaces/RestAPIContentsResponse.md)
- [SavedSessionInfo](interfaces/SavedSessionInfo.md)
- [SavedSessionOptions](interfaces/SavedSessionOptions.md)
- [ServerInfo](interfaces/ServerInfo.md)
- [ServerRestAPI](interfaces/ServerRestAPI.md)
- [ServerRuntime](interfaces/ServerRuntime.md)
- [ServerSettings](interfaces/ServerSettings.md)
- [ThebeCoreGlobal](interfaces/ThebeCoreGlobal.md)
- [ThebeEventData](interfaces/ThebeEventData.md)

### Type Aliases

- [EventObject](modules.md#eventobject)
- [JsonObject](modules.md#jsonobject)
- [KernelISpecModel](modules.md#kernelispecmodel)
- [KernelISpecModels](modules.md#kernelispecmodels)
- [MathjaxOptions](modules.md#mathjaxoptions)
- [SessionIModel](modules.md#sessionimodel)
- [StatusEvent](modules.md#statusevent)
- [ThebeCore](modules.md#thebecore)
- [ThebeEventCb](modules.md#thebeeventcb)

### Variables

- [WIDGET\_MIMETYPE](modules.md#widget_mimetype)

### JS Bundle API Functions

- [connect](modules.md#connect)

### Other Functions

- [ensureCoreOptions](modules.md#ensurecoreoptions)
- [ensureString](modules.md#ensurestring)
- [errorToMessage](modules.md#errortomessage)
- [getRenderMimeRegistry](modules.md#getrendermimeregistry)
- [getRenderers](modules.md#getrenderers)
- [makeBinderOptions](modules.md#makebinderoptions)
- [makeConfiguration](modules.md#makeconfiguration)
- [makeKernelOptions](modules.md#makekerneloptions)
- [makeMathjaxOptions](modules.md#makemathjaxoptions)
- [makeSavedSessionOptions](modules.md#makesavedsessionoptions)
- [makeServerSettings](modules.md#makeserversettings)
- [setupNotebook](modules.md#setupnotebook)
- [setupThebeCore](modules.md#setupthebecore)
- [shortId](modules.md#shortid)

## Type Aliases

### EventObject

Ƭ **EventObject**: [`ThebeServer`](classes/ThebeServer.md) \| [`ThebeSession`](classes/ThebeSession.md) \| [`ThebeNotebook`](classes/ThebeNotebook.md) \| [`ThebeCell`](classes/ThebeCell.md)

#### Defined in

[packages/core/src/events.ts:73](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/events.ts#L73)

___

### JsonObject

Ƭ **JsonObject**: `Record`<`string`, `any`\>

#### Defined in

[packages/core/src/types.ts:8](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/types.ts#L8)

___

### KernelISpecModel

Ƭ **KernelISpecModel**: `KernelSpecAPI.ISpecModel`

#### Defined in

[packages/core/src/types.ts:11](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/types.ts#L11)

___

### KernelISpecModels

Ƭ **KernelISpecModels**: `KernelSpecAPI.ISpecModels`

#### Defined in

[packages/core/src/types.ts:10](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/types.ts#L10)

___

### MathjaxOptions

Ƭ **MathjaxOptions**: `Pick`<[`CoreOptions`](interfaces/CoreOptions.md), ``"mathjaxConfig"`` \| ``"mathjaxUrl"``\>

#### Defined in

[packages/core/src/types.ts:49](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/types.ts#L49)

___

### SessionIModel

Ƭ **SessionIModel**: `Session.IModel`

#### Defined in

[packages/core/src/types.ts:9](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/types.ts#L9)

___

### StatusEvent

Ƭ **StatusEvent**: [`ServerStatusEvent`](enums/ServerStatusEvent.md) \| [`SessionStatusEvent`](enums/SessionStatusEvent.md) \| [`NotebookStatusEvent`](enums/NotebookStatusEvent.md) \| [`CellStatusEvent`](enums/CellStatusEvent.md) \| [`KernelStatusEvent`](enums/KernelStatusEvent.md) \| [`ErrorStatusEvent`](enums/ErrorStatusEvent.md)

#### Defined in

[packages/core/src/events.ts:75](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/events.ts#L75)

___

### ThebeCore

Ƭ **ThebeCore**: typeof [`thebe-core`](modules.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:33](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/thebe/entrypoint.ts#L33)

___

### ThebeEventCb

Ƭ **ThebeEventCb**: (`event`: `string`, `data`: [`ThebeEventData`](interfaces/ThebeEventData.md)) => `void`

#### Type declaration

▸ (`event`, `data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `data` | [`ThebeEventData`](interfaces/ThebeEventData.md) |

##### Returns

`void`

#### Defined in

[packages/core/src/events.ts:91](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/events.ts#L91)

## Variables

### WIDGET\_MIMETYPE

• `Const` **WIDGET\_MIMETYPE**: ``"application/vnd.jupyter.widget-view+json"``

#### Defined in

[packages/core/src/manager.ts:21](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/manager.ts#L21)

## JS Bundle API Functions

### connect

▸ **connect**(`config`): [`ThebeServer`](classes/ThebeServer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](classes/Config.md) |

#### Returns

[`ThebeServer`](classes/ThebeServer.md)

ThebeServer

#### Defined in

[packages/core/src/thebe/api.ts:16](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/thebe/api.ts#L16)

___

## Other Functions

### ensureCoreOptions

▸ **ensureCoreOptions**(`options`, `events?`): `Required`<[`CoreOptions`](interfaces/CoreOptions.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CoreOptions`](interfaces/CoreOptions.md) & { `[k: string]`: `any`;  } |
| `events?` | [`ThebeEvents`](classes/ThebeEvents.md) |

#### Returns

`Required`<[`CoreOptions`](interfaces/CoreOptions.md)\>

#### Defined in

[packages/core/src/options.ts:65](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/options.ts#L65)

___

### ensureString

▸ **ensureString**(`maybeString`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `maybeString` | `string` \| `string`[] |

#### Returns

`string`

#### Defined in

[packages/core/src/utils.ts:14](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/utils.ts#L14)

___

### errorToMessage

▸ **errorToMessage**(`json`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `IError` |

#### Returns

`string`

#### Defined in

[packages/core/src/events.ts:58](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/events.ts#L58)

___

### getRenderMimeRegistry

▸ **getRenderMimeRegistry**(`mathjax?`): `RenderMimeRegistry`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mathjax?` | [`MathjaxOptions`](modules.md#mathjaxoptions) |

#### Returns

`RenderMimeRegistry`

#### Defined in

[packages/core/src/rendermime.ts:58](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/rendermime.ts#L58)

___

### getRenderers

▸ **getRenderers**(`mathjax`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mathjax` | [`MathjaxOptions`](modules.md#mathjaxoptions) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `initialFactories` | `IRendererFactory`[] |
| `latexTypesetter` | `undefined` \| `MathJaxTypesetter` |

#### Defined in

[packages/core/src/rendermime.ts:29](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/rendermime.ts#L29)

___

### makeBinderOptions

▸ **makeBinderOptions**(`opts`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`BinderOptions`](interfaces/BinderOptions.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `binderUrl` | `string` |
| `ref` | `string` |
| `repo` | `string` |
| `repoProvider` | [`RepoProvider`](enums/RepoProvider.md) |

#### Defined in

[packages/core/src/options.ts:13](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/options.ts#L13)

___

### makeConfiguration

▸ **makeConfiguration**(`options`, `events?`): [`Config`](classes/Config.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CoreOptions`](interfaces/CoreOptions.md) & { `[k: string]`: `any`;  } |
| `events?` | [`ThebeEvents`](classes/ThebeEvents.md) |

#### Returns

[`Config`](classes/Config.md)

#### Defined in

[packages/core/src/options.ts:58](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/options.ts#L58)

___

### makeKernelOptions

▸ **makeKernelOptions**(`opts`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`KernelOptions`](interfaces/KernelOptions.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `kernelName` | `string` |
| `name` | `string` |
| `path` | `string` |

#### Defined in

[packages/core/src/options.ts:32](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/options.ts#L32)

___

### makeMathjaxOptions

▸ **makeMathjaxOptions**(`opts?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`MathjaxOptions`](modules.md#mathjaxoptions) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `mathjaxConfig` | `string` |
| `mathjaxUrl` | `string` |

#### Defined in

[packages/core/src/options.ts:50](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/options.ts#L50)

___

### makeSavedSessionOptions

▸ **makeSavedSessionOptions**(`opts`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`SavedSessionOptions`](interfaces/SavedSessionOptions.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `enabled` | `boolean` |
| `maxAge` | `number` |
| `storagePrefix` | `string` |

#### Defined in

[packages/core/src/options.ts:23](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/options.ts#L23)

___

### makeServerSettings

▸ **makeServerSettings**(`settings`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `settings` | [`ServerSettings`](interfaces/ServerSettings.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `appendToken` | `boolean` |
| `baseUrl` | `string` |
| `token` | `string` |
| `wsUrl?` | `string` |

#### Defined in

[packages/core/src/options.ts:41](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/options.ts#L41)

___

### setupNotebook

▸ **setupNotebook**(`blocks`, `options`, `events`): [`ThebeNotebook`](classes/ThebeNotebook.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `blocks` | [`CodeBlock`](interfaces/CodeBlock.md)[] |
| `options` | [`CoreOptions`](interfaces/CoreOptions.md) |
| `events` | [`ThebeEvents`](classes/ThebeEvents.md) |

#### Returns

[`ThebeNotebook`](classes/ThebeNotebook.md)

#### Defined in

[packages/core/src/thebe/api.ts:34](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/thebe/api.ts#L34)

___

### setupThebeCore

▸ **setupThebeCore**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/thebe/api.ts:43](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/thebe/api.ts#L43)

___

### shortId

▸ **shortId**(): `string`

Creates a compact random id for use in runtime objects

#### Returns

`string`

string

#### Defined in

[packages/core/src/utils.ts:10](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/utils.ts#L10)
